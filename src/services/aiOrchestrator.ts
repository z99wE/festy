import { FestiSecurityGuard } from './festiSecurityGuard';
import type { ThreatCategory } from './festiSecurityGuard';
import { generateDeterministicResponse } from './deterministicResponses';
import {
  callDeployedWorkerAPI,
  callCloudflareWorkersAI,
  callGemini,
  callGroq,
  callOpenAI,
  callAnthropic,
} from './llmClients';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OrchestrationAttempt {
  provider: string;
  success: boolean;
  error: string | undefined;
  latencyMs: number;
}

export interface OrchestrationResult {
  content: string;
  providerUsed: string;
  modelUsed: string;
  latencyMs: number;
  attempts: OrchestrationAttempt[];
  isFallback: boolean;
  threatNeutralized: boolean | undefined;
  threatCategory: ThreatCategory | undefined;
  guardReason: string | undefined;
}

export interface LLMConfig {
  cloudflareAccountId: string | undefined;
  cloudflareApiToken: string | undefined;
  geminiApiKey: string | undefined;
  groqApiKey: string | undefined;
  openaiApiKey: string | undefined;
  anthropicApiKey: string | undefined;
  requestTimeoutMs: number | undefined;
}

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 3;
  private readonly coolDownMs = 60000;

  recordSuccess(): void {
    this.failures = 0;
  }

  recordFailure(): void {
    this.failures += 1;
    this.lastFailureTime = Date.now();
  }

  isOpen(): boolean {
    if (this.failures < this.threshold) return false;
    const elapsed = Date.now() - this.lastFailureTime;
    return elapsed <= this.coolDownMs;
  }
}

interface ProviderPipelineStep {
  name: string;
  model: string;
  breakerKey: string;
  isAvailable: () => boolean;
  execute: () => Promise<string | null>;
}

function buildSuccessResult(
  step: ProviderPipelineStep,
  text: string,
  duration: number,
  attempts: OrchestrationAttempt[]
): OrchestrationResult {
  return {
    content: FestiSecurityGuard.sanitizeOutput(text),
    providerUsed: step.name,
    modelUsed: step.model,
    latencyMs: duration,
    attempts,
    isFallback: false,
    threatNeutralized: undefined,
    threatCategory: undefined,
    guardReason: undefined,
  };
}

function resolveEnvKey(customVal: string | undefined, viteVal: string | undefined, nodeVal: string | undefined): string {
  if (customVal) return customVal;
  if (viteVal) return viteVal;
  if (nodeVal) return nodeVal;
  return '';
}

function getRuntimeEnv(): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  try {
    const pEnv = (globalThis as any).process.env;
    if (pEnv) Object.assign(result, pEnv);
  } catch {
    // browser sandbox
  }
  try {
    const vEnv = (import.meta as any).env;
    if (vEnv) Object.assign(result, vEnv);
  } catch {
    // node runtime
  }
  return result;
}

function buildProviderPipeline(
  config: LLMConfig,
  messages: LLMMessage[],
  systemPrompt: string | undefined
): ProviderPipelineStep[] {
  const timeout = config.requestTimeoutMs || 9000;
  return [
    {
      name: 'Edge AI (Llama 3.3 70B)',
      model: '@cf/meta/llama-3.3-70b-instruct',
      breakerKey: 'worker-ai-edge',
      isAvailable: () => typeof window !== 'undefined',
      execute: () => callDeployedWorkerAPI(messages, systemPrompt, timeout),
    },
    {
      name: 'Edge AI Engine',
      model: '@cf/meta/llama-3.3-70b-instruct',
      breakerKey: 'cloudflare',
      isAvailable: () => Boolean(config.cloudflareAccountId && config.cloudflareApiToken),
      execute: () => callCloudflareWorkersAI(messages, config),
    },
    {
      name: 'Google Gemini',
      model: 'gemini-2.5-flash',
      breakerKey: 'gemini',
      isAvailable: () => Boolean(config.geminiApiKey),
      execute: () => callGemini(messages, config),
    },
    {
      name: 'Groq',
      model: 'llama-3.3-70b-versatile',
      breakerKey: 'groq',
      isAvailable: () => Boolean(config.groqApiKey),
      execute: () => callGroq(messages, config),
    },
    {
      name: 'OpenAI',
      model: 'gpt-4o-mini',
      breakerKey: 'openai',
      isAvailable: () => Boolean(config.openaiApiKey),
      execute: () => callOpenAI(messages, config),
    },
    {
      name: 'Anthropic',
      model: 'claude-3-5-haiku-20241022',
      breakerKey: 'anthropic',
      isAvailable: () => Boolean(config.anthropicApiKey),
      execute: () => callAnthropic(messages, config),
    },
  ];
}

async function runPipelineStep(
  providers: ProviderPipelineStep[],
  index: number,
  getBreaker: (key: string) => CircuitBreaker,
  attempts: OrchestrationAttempt[]
): Promise<{ step: ProviderPipelineStep; text: string; duration: number } | null> {
  if (index >= providers.length) return null;
  const step = providers[index];
  if (!step.isAvailable()) {
    return runPipelineStep(providers, index + 1, getBreaker, attempts);
  }
  const breaker = getBreaker(step.breakerKey);
  if (breaker.isOpen()) {
    return runPipelineStep(providers, index + 1, getBreaker, attempts);
  }

  const start = Date.now();
  try {
    const text = await step.execute();
    if (text) {
      breaker.recordSuccess();
      const duration = Date.now() - start;
      attempts.push({ provider: step.name, success: true, error: undefined, latencyMs: duration });
      return { step, text, duration };
    }
  } catch (err: unknown) {
    const duration = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    breaker.recordFailure();
    attempts.push({ provider: step.name, success: false, error: msg, latencyMs: duration });
  }
  return runPipelineStep(providers, index + 1, getBreaker, attempts);
}

/**
 * MultiLLMOrchestrator manages multi-tier resilient fallback execution across
 * Cloudflare Workers AI, Google Gemini, Groq, OpenAI, and Anthropic.
 */
export class MultiLLMOrchestrator {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private config: LLMConfig;

  constructor(customConfig: Partial<LLMConfig> = {}) {
    const env = getRuntimeEnv();

    this.config = {
      cloudflareAccountId: resolveEnvKey(customConfig.cloudflareAccountId, env.VITE_CF_ACCOUNT_ID, env.CLOUDFLARE_ACCOUNT_ID),
      cloudflareApiToken: resolveEnvKey(customConfig.cloudflareApiToken, env.VITE_CF_API_TOKEN, env.CLOUDFLARE_API_TOKEN),
      geminiApiKey: resolveEnvKey(customConfig.geminiApiKey, env.VITE_GEMINI_API_KEY, env.GEMINI_API_KEY),
      groqApiKey: resolveEnvKey(customConfig.groqApiKey, env.VITE_GROQ_API_KEY, env.GROQ_API_KEY),
      openaiApiKey: resolveEnvKey(customConfig.openaiApiKey, env.VITE_OPENAI_API_KEY, env.OPENAI_API_KEY),
      anthropicApiKey: resolveEnvKey(customConfig.anthropicApiKey, env.VITE_ANTHROPIC_API_KEY, env.ANTHROPIC_API_KEY),
      requestTimeoutMs: customConfig.requestTimeoutMs || 9000,
    };
  }

  private getCircuitBreaker(provider: string): CircuitBreaker {
    let cb = this.circuitBreakers.get(provider);
    if (!cb) {
      cb = new CircuitBreaker();
      this.circuitBreakers.set(provider, cb);
    }
    return cb;
  }

  /**
   * Generates AI completion using prioritized pipeline with automatic security inspection.
   *
   * @param messages Array of conversational messages
   * @param systemPrompt Optional system instruction
   * @returns Orchestrated completion result with telemetry
   */
  async generateCompletion(
    messages: LLMMessage[],
    systemPrompt: string | undefined
  ): Promise<OrchestrationResult> {
    const overallStartTime = Date.now();

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUserMessage ? lastUserMessage.content : '';
    const guardEval = FestiSecurityGuard.evaluate(userText);

    if (!guardEval.isSafe) {
      const duration = Math.max(1, Date.now() - overallStartTime);
      const defl = guardEval.deflectionResponse || 'I am Festi, your celebration architect! How can I assist with your event?';
      const guardAttempt: OrchestrationAttempt = {
        provider: 'Festi AI Security Guard',
        success: true,
        error: undefined,
        latencyMs: duration,
      };
      return {
        content: defl,
        providerUsed: 'Festi AI Security Guard',
        modelUsed: 'Hard-Drill-Defense-Engine',
        latencyMs: duration,
        attempts: [guardAttempt],
        isFallback: false,
        threatNeutralized: true,
        threatCategory: guardEval.category,
        guardReason: guardEval.reason,
      };
    }

    const fullMessages: LLMMessage[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const attempts: OrchestrationAttempt[] = [];
    const providers = buildProviderPipeline(this.config, fullMessages, systemPrompt);

    const stepResult = await runPipelineStep(
      providers,
      0,
      (key) => this.getCircuitBreaker(key),
      attempts
    );

    if (stepResult) {
      return buildSuccessResult(stepResult.step, stepResult.text, stepResult.duration, attempts);
    }

    const fallbackSource = messages[messages.length - 1];
    const fallbackText = generateDeterministicResponse(fallbackSource ? fallbackSource.content : '');
    const duration = Date.now() - overallStartTime;
    const fallbackAttempt: OrchestrationAttempt = {
      provider: 'Deterministic Fallback Engine',
      success: true,
      error: undefined,
      latencyMs: duration,
    };
    attempts.push(fallbackAttempt);

    return {
      content: fallbackText,
      providerUsed: 'Deterministic Fallback Engine',
      modelUsed: 'Domain-Rule-Synthesizer',
      latencyMs: duration,
      attempts,
      isFallback: true,
      threatNeutralized: undefined,
      threatCategory: undefined,
      guardReason: undefined,
    };
  }

  generateDeterministicResponse(query: string): string {
    return generateDeterministicResponse(query);
  }
}

export const aiOrchestrator = new MultiLLMOrchestrator();
