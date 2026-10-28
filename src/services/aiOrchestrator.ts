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

import { FestiSecurityGuard, type ThreatCategory } from './festiSecurityGuard';

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
  threatNeutralized?: boolean;
  threatCategory?: ThreatCategory;
  guardReason?: string;
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
    const overallStartTime = Date.now();

    // 0. PRE-FLIGHT HARD DRILL & THREAT EVALUATION
    // Defends against LLM Hijacking, Jacking, Spooking, Meta-Prompting, and Domain Violations
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const guardEval = FestiSecurityGuard.evaluate(lastUserMessage);

    if (!guardEval.isSafe) {
      const duration = Date.now() - overallStartTime;
      return {
        content: guardEval.deflectionResponse || 'I am Festi, your Festi AI celebration architect! How can I assist with your event?',
        providerUsed: 'Festi AI Security Guard',
        modelUsed: 'Hard-Drill-Defense-Engine',
        latencyMs: Math.max(1, duration),
        attempts: [
          {
            provider: 'Festi AI Security Guard',
            success: true,
            latencyMs: Math.max(1, duration),
          },
        ],
        isFallback: false,
        threatNeutralized: true,
        threatCategory: guardEval.category,
        guardReason: guardEval.reason,
      };
    }

    const fullMessages: LLMMessage[] = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const attempts: OrchestrationResult['attempts'] = [];

    // 1. PRIMARY: Cloudflare Workers AI Endpoint (/api/ai)
    // Directly executes @cf/meta/llama-3.3-70b-instruct on Cloudflare's Edge
    if (!this.getCircuitBreaker('worker-ai-edge').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callDeployedWorkerAPI(fullMessages, systemPrompt);
        if (text) {
          this.getCircuitBreaker('worker-ai-edge').recordSuccess();
          const duration = Date.now() - start;
          attempts.push({ provider: 'Edge AI (Llama 3.3 70B)', success: true, latencyMs: duration });
          return {
            content: FestiSecurityGuard.sanitizeOutput(text),
            providerUsed: 'Edge AI (Llama 3.3 70B)',
            modelUsed: '@cf/meta/llama-3.3-70b-instruct',
            latencyMs: duration,
            attempts,
            isFallback: false,
          };
        }
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const msg = err instanceof Error ? err.message : String(err);
        this.getCircuitBreaker('worker-ai-edge').recordFailure();
        attempts.push({ provider: 'Edge AI (Edge)', success: false, error: msg, latencyMs: duration });
      }
    }

    // 2. SECONDARY: Direct Cloudflare Workers AI Client
    if (this.config.cloudflareAccountId && this.config.cloudflareApiToken && !this.getCircuitBreaker('cloudflare').isOpen()) {
      const start = Date.now();
      try {
        const text = await this.callCloudflareWorkersAI(fullMessages);
        this.getCircuitBreaker('cloudflare').recordSuccess();
        const duration = Date.now() - start;
        attempts.push({ provider: 'Edge AI Engine', success: true, latencyMs: duration });
        return {
          content: FestiSecurityGuard.sanitizeOutput(text),
          providerUsed: 'Edge AI Engine',
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
          content: FestiSecurityGuard.sanitizeOutput(text),
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
          content: FestiSecurityGuard.sanitizeOutput(text),
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
          content: FestiSecurityGuard.sanitizeOutput(text),
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
          content: FestiSecurityGuard.sanitizeOutput(text),
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
      content: FestiSecurityGuard.sanitizeOutput(fallbackText),
      providerUsed: 'Festiya Deterministic Engine',
      modelUsed: 'festiya-heuristic-v2',
      latencyMs: duration,
      attempts,
      isFallback: true,
    };
  }

  // --- Provider Implementations ---

  private async callDeployedWorkerAPI(messages: LLMMessage[], systemPrompt?: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const resp = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        throw new Error(`Worker AI HTTP ${resp.status}`);
      }

      const data = (await resp.json()) as { response?: string; error?: string };
      if (data.response && typeof data.response === 'string') {
        return data.response;
      }
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

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
   * Comprehensive celebration intelligence backup that runs in 0ms with zero network dependency.
   */
  public generateDeterministicResponse(userQuery: string): string {
    const q = userQuery.toLowerCase();

    // 1. Day-of Run of Show / Minute-by-Minute Timeline
    if (
      q.includes('run of show') ||
      q.includes('run-of-show') ||
      q.includes('minute-by-minute') ||
      q.includes('timeline') ||
      q.includes('schedule') ||
      q.includes('agenda')
    ) {
      const occasion = q.includes('wedding')
        ? 'Wedding Celebration'
        : q.includes('birthday')
        ? 'Milestone Birthday Party'
        : q.includes('retreat') || q.includes('offsite')
        ? 'Leadership Offsite'
        : q.includes('festival')
        ? 'Music Festival & Carnival'
        : 'Celebration Blueprint';

      return `Festi AI Day-of Run of Show Blueprint (${occasion}):\n\n` +
        `• 08:00 – 10:30 | Load-in & Production Grid: Vendor arrivals, staging power drops, A/V microphone line checks, and emergency contact verification.\n` +
        `• 11:00 – 13:30 | Catering & Floral Staging: Cold prep arrival, linen steaming, bar glassware alignment, and environmental lighting focus.\n` +
        `• 16:30 – 17:30 | Guest Arrival & Welcome Atmosphere: Low-tempo acoustic playlist, signature welcome drinks passed, and photo moment greeting.\n` +
        `• 17:30 – 18:15 | Main Kickoff / Ceremony / Keynote: Sound cues active, house lights dimmed, primary program executed with zero lag.\n` +
        `• 18:30 – 20:30 | Feast & Coordinated Toasts: Family-style courses served; 3-minute max toast intervals scheduled between entrees.\n` +
        `• 20:30 – 23:00 | Prime Entertainment & High-Energy Celebration: Dance floor opening crescendo, dessert stations active, late-night savory bite pass.\n` +
        `• 23:00 – 00:00 | Soft Load-Out & Egress: Ambient lighting shift, safe guest transport/rideshare dispatch, vendor walk-through and deposit sign-off.`;
    }

    // 2. Budget Optimization & Savings
    if (
      q.includes('budget') ||
      q.includes('optimize') ||
      q.includes('save') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('$') ||
      q.includes('20%')
    ) {
      return `Festi AI Budget Allocation & 20% Cost Optimization Architecture:\n\n` +
        `1. High-Calm Resource Distribution:\n` +
        `   • Catering, Food & Bar (38–42%): The single most impactful sensory touchpoint.\n` +
        `   • Venue & Basic Infrastructure (24–28%): Space layout, power drops, security.\n` +
        `   • Entertainment & Sound/Lighting (12–15%): Sound engineering & lighting transitions.\n` +
        `   • Photography & Media Capture (10–12%): High-res memories, golden-hour coverage.\n` +
        `   • Contingency Reserve (8–10%): Mandatory buffer for unexpected weather or overtime.\n\n` +
        `2. Top 3 High-Leverage Strategies to Save 20%:\n` +
        `   • Switch to Interactive Food Stations: Cuts server headcount by 40% compared to formal multi-course plated service.\n` +
        `   • Ambient Architectural Uplighting: Warm LED perimeter washes cost 70% less than exorbitant floral installations and create double the visual warmth.\n` +
        `   • Fixed Bar Package vs. Consumption: Negotiate a flat per-head open bar with 2 signature cocktails to eliminate surprise midnight overages.`;
    }

    // 3. Vendor Negotiation Questions & Scripts
    if (
      q.includes('vendor') ||
      q.includes('negotiat') ||
      q.includes('question') ||
      q.includes('contract') ||
      q.includes('cater') ||
      q.includes('venue') ||
      q.includes('dj')
    ) {
      return `Festi AI Vendor Negotiation Battle-Tested Script:\n\n` +
        `Ask every shortlisted vendor these 5 non-negotiable questions before signing:\n\n` +
        `1. "What is the comprehensive 'out-the-door' quote including service fees, taxes, and gratuity?"\n` +
        `   (Venues and caterers frequently add 20–26% admin fees that aren't on initial pricing sheets).\n\n` +
        `2. "What are the exact load-in and load-out hour restrictions, and what is your per-minute overtime rate?"\n` +
        `   (Prevents sudden $500/hour penalty fees if celebrations run 20 minutes late).\n\n` +
        `3. "What happens if our primary contact, chef, or lead artist is sick or incapacitated on event day?"\n` +
        `   (Verify named backup coverage in writing directly inside the contract SLA).\n\n` +
        `4. "Can we provide our own specialty wine or spirits with a capped flat corkage fee?"\n` +
        `   (Typically saves $1,000–$3,000 on beverage packages).\n\n` +
        `5. "What is the tiered milestone cancellation and force-majeure rescheduling policy?"\n` +
        `   (Never agree to 100% non-refundable deposits beyond the initial 25% booking fee).`;
    }

    // 4. Creative Experience & Sensory Decor Ideas
    if (
      q.includes('idea') ||
      q.includes('decor') ||
      q.includes('theme') ||
      q.includes('unique') ||
      q.includes('sensory') ||
      q.includes('experience')
    ) {
      return `Festi AI Multi-Sensory Celebration Blueprint:\n\n` +
        `• Visual Impact: Ditch generic printed banners; install ambient 2700K warm wash perimeter lighting, customized vintage brass signage, and a dedicated high-contrast photo wall.\n` +
        `• Auditory Arc: Transition the room energy deliberately: Start with acoustic lo-fi jazz during welcome drinks (60–75 BPM), build to upbeat neo-soul during dinner (85–100 BPM), and crescendo to nu-disco dance rhythms (118–124 BPM).\n` +
        `• Taste & Scent: Introduce a signature aromatic element (fresh rosemary smoked cocktails or warm cinnamon sugar beignets passed at 22:00) that anchors olfactory memories for years.\n` +
        `• Interactive Guest Moment: A live audio guestbook booth or a polaroid keepsake wall where guests write memories creates instant intimacy without awkward icebreakers.`;
    }

    // 5. Birthdays & Milestones
    if (
      q.includes('birthday') ||
      q.includes('bday') ||
      q.includes('sweet 16') ||
      q.includes('50th') ||
      q.includes('30th') ||
      q.includes('40th') ||
      q.includes('21st')
    ) {
      return `Festi AI Milestone Birthday Celebration Blueprint:\n\n` +
        `• 8 Weeks Out: Lock the venue and choose a signature concept (e.g. Havana Nights, Neon Velvet Lounge, or Golden Hour Rooftop).\n` +
        `• 4 Weeks Out: Send calendar invitations with explicit dress codes and dietary preference collection.\n` +
        `• 2 Weeks Out: Finalize the 2 signature drinks ('The Birthday Toast' + 'The Designated Driver Cooler') and order custom dessert displays.\n` +
        `• Day-of Pro-Tip: Cue the tribute speeches or video slideshow strictly right BEFORE the main cake cutting—never when the dance floor is already rocking!`;
    }

    // 6. Weddings & Receptions
    if (
      q.includes('wedding') ||
      q.includes('reception') ||
      q.includes('bride') ||
      q.includes('groom') ||
      q.includes('marriage')
    ) {
      return `Festi AI Dream Wedding Operational Architecture:\n\n` +
        `• Core Principle: Pick your top 2 non-negotiables (e.g., exceptional food + killer live band). Spend 60% of your emotional energy and budget on those two, and streamline everything else.\n` +
        `• Pacing Secret: Keep the transition between ceremony and dinner under 75 minutes. Long cocktail hours without seating cause guest energy slumps.\n` +
        `• Vendor Harmony: Ensure the photographer, DJ/MC, and caterer share a single master run-of-show so courses are never served during speeches.`;
    }

    // 7. General Festi AI Capabilities / Greetings / Onboarding
    if (
      q.includes('what can you do') ||
      q.includes('how does') ||
      q.includes('who are you') ||
      q.includes('help') ||
      q.includes('start') ||
      q.includes('features') ||
      q.includes('what do you do')
    ) {
      return `Welcome to Festi AI! 🎉 I'm Festi, your autonomous celebration architect.\n\n` +
        `Here is how I can build your next event:\n` +
        `• 📊 3-Tier Budget Synthesizer: Dial in exact cost allocations and discover ways to save 20% on vendors.\n` +
        `• ⏱️ Day-of Run-of-Show Generator: Minute-by-minute cues for seamless pacing from load-in to egress.\n` +
        `• 📝 Vendor Negotiation Scripts: The exact questions to ask caterers, venues, and DJs to avoid $1,000s in hidden fees.\n` +
        `• 💡 Sensory Decor & Themes: Lighting, music BPM arcs, and immersive guest experiences.\n\n` +
        `Try asking me: "Plan a 40th birthday for 40 guests on a $4,000 budget" or "Give me a run-of-show schedule for a wedding"!`;
    }

    // Default Bespoke Planning Response
    return `Festi AI Celebration Master Blueprint:\n\n` +
      `Here is the 3-step action roadmap to execute your celebration vision:\n\n` +
      `1. Parameter Lock: Establish your guest range and 3-tier budget (Comfort, Likely, Dream). This prevents endless vendor quote renegotiations.\n` +
      `2. Pacing & Flow: Anchor your key milestones (Guest arrival, main feature/toasts, prime celebration, soft egress) with intentional lighting and music cues.\n` +
      `3. Vendor Shielding: Request all vendor estimates as itemized "out-the-door" totals including overtime, taxes, and service charges.\n\n` +
      `Would you like to build an itemized budget breakdown or generate a minute-by-minute schedule?`;
  }
}

// Global shared singleton orchestrator
export const aiOrchestrator = new MultiLLMOrchestrator();
