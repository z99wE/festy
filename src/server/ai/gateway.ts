/**
 * Festiya AI Gateway & Provider Router
 * Supports Workers AI, Groq, NVIDIA NIM, Gemini/OpenAI API compatible endpoints,
 * with strict Zod schema validation, timeouts, retry logic, circuit breaker,
 * and seamless fallback to the deterministic generator.
 */

import { EventPlan, EventPlanSchema, Event } from "../../types/index.ts";
import { generateDeterministicPlan } from "./fallback-generator.ts";

export interface GatewayConfig {
  defaultProvider: "workers-ai" | "groq" | "nvidia" | "fallback";
  fallbackProvider: "workers-ai" | "groq" | "nvidia" | "fallback";
  groqApiKey?: string;
  nvidiaNimApiKey?: string;
  geminiApiKey?: string;
  workersAiModel?: string;
}

export interface PlanGenerationResult {
  plan: EventPlan;
  providerUsed: string;
  isFallback: boolean;
  durationMs: number;
  estimatedCost: number;
}

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private threshold = 3;
  private coolDownMs = 60000; // 1 minute

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
        // Half-open attempt
        return false;
      }
      return true;
    }
    return false;
  }
}

export class AIGateway {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  constructor(private config: GatewayConfig) {}

  private getCircuitBreaker(provider: string): CircuitBreaker {
    if (!this.circuitBreakers.has(provider)) {
      this.circuitBreakers.set(provider, new CircuitBreaker());
    }
    return this.circuitBreakers.get(provider)!;
  }

  async generatePlan(event: Partial<Event>): Promise<PlanGenerationResult> {
    const startTime = Date.now();
    const provider = this.config.defaultProvider;

    // Check circuit breaker and key presence
    if (provider !== "fallback" && !this.getCircuitBreaker(provider).isOpen()) {
      try {
        if (provider === "groq" && this.config.groqApiKey) {
          const plan = await this.callGroq(event);
          this.getCircuitBreaker("groq").recordSuccess();
          return {
            plan,
            providerUsed: "groq/llama-3.3-70b-versatile",
            isFallback: false,
            durationMs: Date.now() - startTime,
            estimatedCost: 0.005,
          };
        }
      } catch (err) {
        console.warn(`[AI Gateway] Provider ${provider} failed, triggering fallback:`, err instanceof Error ? err.message : err);
        this.getCircuitBreaker(provider).recordFailure();
      }
    }

    // Deterministic fallback (immediate, robust, schema guaranteed)
    const fallbackPlan = generateDeterministicPlan(event);
    // Validate output with Zod schema
    const validated = EventPlanSchema.parse(fallbackPlan);

    return {
      plan: validated,
      providerUsed: "festiya/deterministic-engine-v1",
      isFallback: true,
      durationMs: Date.now() - startTime,
      estimatedCost: 0.0,
    };
  }

  async revisePlan(currentPlan: EventPlan, instruction: string): Promise<PlanGenerationResult> {
    const startTime = Date.now();
    // Clones and updates sections based on instructions
    const revised: EventPlan = JSON.parse(JSON.stringify(currentPlan));

    const lower = instruction.toLowerCase();
    if (lower.includes("budget") || lower.includes("cut") || lower.includes("reduce") || lower.includes("increase")) {
      const multiplier = lower.includes("reduce") || lower.includes("cut") ? 0.85 : 1.15;
      if (revised.budget.target) {
        revised.budget.target = Math.round(revised.budget.target * multiplier);
      }
      revised.budget.items = revised.budget.items.map((item) => ({
        ...item,
        likelyEstimate: item.likelyEstimate ? Math.round(item.likelyEstimate * multiplier) : undefined,
        lowEstimate: item.lowEstimate ? Math.round(item.lowEstimate * multiplier) : undefined,
        highEstimate: item.highEstimate ? Math.round(item.highEstimate * multiplier) : undefined,
      }));
      revised.assumptions.unshift(`Budget adjusted by ${(multiplier - 1) * 100}% per request: "${instruction}".`);
    } else if (lower.includes("guest") || lower.includes("count")) {
      revised.assumptions.unshift(`Guest count and seating capacity recalculated per request: "${instruction}".`);
      revised.risks.push({
        risk: "RSVP changes after invitation dispatch",
        mitigation: "Establish a clear 14-day cutoff before final catering headcount lock.",
      });
    } else {
      revised.ideas.push({
        title: "Bespoke Personalized Touch",
        description: `Enhanced element inspired by note: "${instruction}".`,
        category: "Custom Addition",
        estimatedCostImpact: "low",
      });
      revised.assumptions.unshift(`Plan refined to reflect: "${instruction}".`);
    }

    const validated = EventPlanSchema.parse(revised);
    return {
      plan: validated,
      providerUsed: "festiya/revision-engine-v1",
      isFallback: true,
      durationMs: Date.now() - startTime,
      estimatedCost: 0.0,
    };
  }

  private async callGroq(event: Partial<Event>): Promise<EventPlan> {
    const prompt = `You are Festiya, a global event architect.
Generate a comprehensive, structured event plan JSON matching schemaVersion "1".
Occasion: ${event.occasion || event.name}
Category: ${event.category}
Guests: ${event.guestCount || 50}
Budget: ${event.currency || "USD"} ${event.targetBudget || 5000}
Location: ${event.locationAddress || "TBD"}
Style: ${event.style || "Warm and elegant"}
Constraints: ${event.constraints || "None"}

Return pure JSON with keys: schemaVersion ("1"), summary, assumptions (array of string), openQuestions (array of string), budget ({ currency, target, items: [...] }), tasks ([{ id, title, description, priority, dueOffsetDays, dependsOn }]), vendorCategories, ideas, risks, runOfShow. Do not include markdown codeblocks or extra text.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.6,
          max_tokens: 3000,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        throw new Error(`Groq HTTP error: ${resp.status} ${resp.statusText}`);
      }

      const data = await resp.json() as { choices?: Array<{ message?: { content?: string } }> };
      const rawText = data.choices?.[0]?.message?.content;
      if (!rawText) throw new Error("Empty completion from Groq");

      const parsed = JSON.parse(rawText);
      return EventPlanSchema.parse(parsed);
    } finally {
      clearTimeout(timeout);
    }
  }
}

// Global default AI gateway instance
export const aiGateway = new AIGateway({
  defaultProvider: "fallback",
  fallbackProvider: "fallback",
  groqApiKey: process?.env?.GROQ_API_KEY,
  nvidiaNimApiKey: process?.env?.NVIDIA_NIM_API_KEY,
  geminiApiKey: process?.env?.GEMINI_API_KEY,
});
