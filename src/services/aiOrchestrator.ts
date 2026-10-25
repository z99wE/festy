/**
 * Festiya Multi-LLM Cascading Orchestrator
 * 
 * Cascades requests across multiple AI providers with strict priority order:
 * 1. Cloudflare Workers AI (@cf/meta/llama-3.3-70b-instruct or @cf/deepseek-ai/deepseek-r1-distill-qwen-32b) [PRIMARY]
 * 2. Google Gemini (gemini-2.5-flash / gemini-1.5-flash) [SECONDARY]
 * 3. Groq (llama-3.3-70b-versatile) [TERTIARY]
 * 4. OpenAI (gpt-4o-mini) [QUATERNARY]
 * 5. Anthropic (claude-3-5-haiku) [QUINARY]
 * 6. Festiya Deterministic Event Engine [SAFETY NET: 0ms, 100% schema guaranteed]
 *
 * Each provider has its own timeout and circuit breaker to prevent slow cascades.
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OrchestrationResult {
  content: string;
  providerUsed: string;
  modelUsed: string;
  latencyMs: number;
  attempts: Array<{
    provider: string;
    success: boolean;
    error?: string;
    latencyMs: number;
  }>;
  isFallback: boolean;
}

export interface LLMConfig {
  cloudflareAccountId?: string;
  cloudflareApiToken?: string;
  geminiApiKey?: string;
  groqApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  requestTimeoutMs?: number;
}

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 3;
  private readonly coolDownMs = 60000; // 1 minute cooldown

  recordSuccess(): void {
    this.failures = 0;
  }

  recordFailure(): void {
    this.failures += 1;
    this.lastFailureTime = Date.now();
  }

  isOpen(): boolean {
    if (this.failures >= this.threshold) {
      if (Date.now() - this.lastFailureTime > this.coolDownMs) {
        return false; // half-open: permit trial attempt
      }
      return true;
    }
    return false;
  }
}

export class MultiLLMOrchestrator {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private config: LLMConfig;

  constructor(customConfig?: Partial<LLMConfig>) {
    // Read from Vite env, Cloudflare Worker bindings, or window globals
    const globalObj = typeof globalThis !== 'undefined' ? (globalThis as unknown as { process?: { env?: Record<string, string> } }) : {};
    const env = globalObj.process?.env || {};
    const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) || {};

    this.config = {
      cloudflareAccountId: customConfig?.cloudflareAccountId || viteEnv.VITE_CF_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || '',
      cloudflareApiToken: customConfig?.cloudflareApiToken || viteEnv.VITE_CF_API_TOKEN || env.CLOUDFLARE_API_TOKEN || '',
      geminiApiKey: customConfig?.geminiApiKey || viteEnv.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '',
      groqApiKey: customConfig?.groqApiKey || viteEnv.VITE_GROQ_API_KEY || env.GROQ_API_KEY || '',
      openaiApiKey: customConfig?.openaiApiKey || viteEnv.VITE_OPENAI_API_KEY || env.OPENAI_API_KEY || '',
      anthropicApiKey: customConfig?.anthropicApiKey || viteEnv.VITE_ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY || '',
      requestTimeoutMs: customConfig?.requestTimeoutMs || 9000,
    };
  }

  private getCircuitBreaker(provider: string): CircuitBreaker {
    if (!this.circuitBreakers.has(provider)) {
      this.circuitBreakers.set(provider, new CircuitBreaker());
    }
    return this.circuitBreakers.get(provider)!;
  }

  /**
   * Orchestrates prompt or multi-turn chat across available LLMs in order of preference.
   */
  async generateCompletion(
    messages: LLMMessage[],
    systemPrompt?: string
  ): Promise<OrchestrationResult> {
    const fullMessages: LLMMessage[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const attempts: OrchestrationResult['attempts'] = [];
    const overallStartTime = Date.now();

    // 1. PRIMARY: Cloudflare Workers AI
    if (this.config.cloudflareAccountId && this.config.cloudflareApiToken && !this.getCircuitBreaker('cloudflare').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callCloudflareWorkersAI(fullMessages);
        this.getCircuitBreaker('cloudflare').recordSuccess();
        const duration = Date.now() - start;
        attempts.push({ provider: 'Cloudflare Workers AI', success: true, latencyMs: duration });
        return {
          content: text,
          providerUsed: 'Cloudflare Workers AI',
          modelUsed: '@cf/meta/llama-3.3-70b-instruct',
          latencyMs: duration,
          attempts,
          isFallback: false,
        };
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const msg = err instanceof Error ? err.message : String(err);
        this.getCircuitBreaker('cloudflare').recordFailure();
        attempts.push({ provider: 'Cloudflare Workers AI', success: false, error: msg, latencyMs: duration });
        console.warn('[AI Orchestrator] Cloudflare Workers AI failed, failing over to next provider:', msg);
      }
    }

    // 2. SECONDARY: Google Gemini
    if (this.config.geminiApiKey && !this.getCircuitBreaker('gemini').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callGemini(fullMessages);
        this.getCircuitBreaker('gemini').recordSuccess();
        const duration = Date.now() - start;
        attempts.push({ provider: 'Google Gemini', success: true, latencyMs: duration });
        return {
          content: text,
          providerUsed: 'Google Gemini',
          modelUsed: 'gemini-2.5-flash',
          latencyMs: duration,
          attempts,
          isFallback: false,
        };
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const msg = err instanceof Error ? err.message : String(err);
        this.getCircuitBreaker('gemini').recordFailure();
        attempts.push({ provider: 'Google Gemini', success: false, error: msg, latencyMs: duration });
        console.warn('[AI Orchestrator] Google Gemini failed, failing over to next provider:', msg);
      }
    }

    // 3. TERTIARY: Groq (ultra fast sub-200ms inference)
    if (this.config.groqApiKey && !this.getCircuitBreaker('groq').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callGroq(fullMessages);
        this.getCircuitBreaker('groq').recordSuccess();
        const duration = Date.now() - start;
        attempts.push({ provider: 'Groq', success: true, latencyMs: duration });
        return {
          content: text,
          providerUsed: 'Groq',
          modelUsed: 'llama-3.3-70b-versatile',
          latencyMs: duration,
          attempts,
          isFallback: false,
        };
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const msg = err instanceof Error ? err.message : String(err);
        this.getCircuitBreaker('groq').recordFailure();
        attempts.push({ provider: 'Groq', success: false, error: msg, latencyMs: duration });
        console.warn('[AI Orchestrator] Groq failed, failing over to next provider:', msg);
      }
    }

    // 4. QUATERNARY: OpenAI
    if (this.config.openaiApiKey && !this.getCircuitBreaker('openai').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callOpenAI(fullMessages);
        this.getCircuitBreaker('openai').recordSuccess();
        const duration = Date.now() - start;
        attempts.push({ provider: 'OpenAI', success: true, latencyMs: duration });
        return {
          content: text,
          providerUsed: 'OpenAI',
          modelUsed: 'gpt-4o-mini',
          latencyMs: duration,
          attempts,
          isFallback: false,
        };
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const msg = err instanceof Error ? err.message : String(err);
        this.getCircuitBreaker('openai').recordFailure();
        attempts.push({ provider: 'OpenAI', success: false, error: msg, latencyMs: duration });
        console.warn('[AI Orchestrator] OpenAI failed, failing over to next provider:', msg);
      }
    }

    // 5. QUINARY: Anthropic
    if (this.config.anthropicApiKey && !this.getCircuitBreaker('anthropic').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callAnthropic(fullMessages);
        this.getCircuitBreaker('anthropic').recordSuccess();
        const duration = Date.now() - start;
        attempts.push({ provider: 'Anthropic', success: true, latencyMs: duration });
        return {
          content: text,
          providerUsed: 'Anthropic',
          modelUsed: 'claude-3-5-haiku-20241022',
          latencyMs: duration,
          attempts,
          isFallback: false,
        };
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const msg = err instanceof Error ? err.message : String(err);
        this.getCircuitBreaker('anthropic').recordFailure();
        attempts.push({ provider: 'Anthropic', success: false, error: msg, latencyMs: duration });
        console.warn('[AI Orchestrator] Anthropic failed, failing over to local safety net:', msg);
      }
    }

    // 6. ZERO-FAIL SAFETY NET: Festiya Deterministic Engine (runs offline, 0ms)
    const fallbackText = this.generateDeterministicResponse(messages[messages.length - 1]?.content || '');
    const duration = Date.now() - overallStartTime;
    attempts.push({ provider: 'Festiya Heuristic Engine', success: true, latencyMs: 1 });

    return {
      content: fallbackText,
      providerUsed: 'Festiya Deterministic Engine',
      modelUsed: 'festiya-heuristic-v2',
      latencyMs: duration,
      attempts,
      isFallback: true,
    };
  }

  // --- Provider Implementations ---

  private async callCloudflareWorkersAI(messages: LLMMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const model = '@cf/meta/llama-3.3-70b-instruct';
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.config.cloudflareAccountId}/ai/run/${model}`;

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          max_tokens: 1024,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        throw new Error(`Cloudflare AI HTTP ${resp.status}: ${resp.statusText}`);
      }

      const data = await resp.json() as { result?: { response?: string }; success?: boolean };
      if (!data.result?.response) {
        throw new Error('Invalid response structure from Cloudflare Workers AI');
      }

      return data.result.response;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async callGemini(messages: LLMMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const model = 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.geminiApiKey}`;

      // Convert messages to Gemini format
      const contents = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const systemMsg = messages.find((m) => m.role === 'system');

      const body: Record<string, unknown> = {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      };

      if (systemMsg) {
        body.systemInstruction = {
          parts: [{ text: systemMsg.content }],
        };
      }

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!resp.ok) {
        throw new Error(`Google Gemini HTTP ${resp.status}: ${resp.statusText}`);
      }

      const data = await resp.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) throw new Error('No candidate response from Gemini');

      return reply;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async callGroq(messages: LLMMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) throw new Error(`Groq HTTP ${resp.status}: ${resp.statusText}`);

      const data = await resp.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from Groq');

      return content;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async callOpenAI(messages: LLMMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) throw new Error(`OpenAI HTTP ${resp.status}: ${resp.statusText}`);

      const data = await resp.json() as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from OpenAI');

      return content;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async callAnthropic(messages: LLMMessage[]): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const systemMsg = messages.find((m) => m.role === 'system');
      const nonSystemMessages = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.config.anthropicApiKey!,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
          'dangerously-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          system: systemMsg?.content,
          messages: nonSystemMessages,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) throw new Error(`Anthropic HTTP ${resp.status}: ${resp.statusText}`);

      const data = await resp.json() as {
        content?: Array<{ text?: string }>;
      };

      const content = data.content?.[0]?.text;
      if (!content) throw new Error('Empty response from Anthropic');

      return content;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Deterministic local backup that runs in 0ms with zero network dependency.
   */
  private generateDeterministicResponse(userQuery: string): string {
    const q = userQuery.toLowerCase();

    if (q.includes('budget') || q.includes('cost') || q.includes('price')) {
      return "Here is Festiya's recommended budget distribution:\n• Venue & Catering: 45–50%\n• Photography & Media: 12–15%\n• Decor & Lighting: 10–12%\n• Entertainment/Music: 8–10%\n• Contingency reserve: 10%\n\nYou can customize these exact percentages with our interactive budget sliders in the Live Planner section!";
    }

    if (q.includes('wedding') || q.includes('bride') || q.includes('groom')) {
      return "For a memorable wedding, focus on 3 core pillars:\n1. Lock your venue and primary caterer at least 6 months out.\n2. Create a realistic 3-tier budget (low, likely, high) to prevent unexpected overages.\n3. Send Save-the-Dates 4–6 months ahead with RSVP deadlines locked 30 days prior.";
    }

    if (q.includes('vendor') || q.includes('checklist') || q.includes('contract')) {
      return "Top 3 vendor negotiation questions you should ask before signing:\n1. 'What is included in the base fee vs overtime rate?'\n2. 'What is the exact backup plan if your primary staff is unavailable?'\n3. 'What is the payment milestone breakdown and refund cancellation schedule?'";
    }

    return "I'm Festi, your Festi AI event architect! I can help you architect detailed budgets, prioritize milestone schedules, draft vendor negotiation questions, or suggest creative theme concepts. What type of celebration are we planning today?";
  }
}

// Global shared singleton orchestrator
export const aiOrchestrator = new MultiLLMOrchestrator();
