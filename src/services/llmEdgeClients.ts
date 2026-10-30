import type { LLMMessage, LLMConfig } from './aiOrchestrator';

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  role?: string;
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
}

function toGeminiPart(text: string): GeminiPart {
  return { text };
}

function toGeminiContent(m: LLMMessage): GeminiContent {
  const role = m.role === 'assistant' ? 'model' : 'user';
  return { role, parts: [toGeminiPart(m.content)] };
}

/**
 * Calls deployed Cloudflare Worker API endpoint for server-side AI proxying.
 *
 * @param messages Array of conversational LLM messages
 * @param systemPrompt Optional system instruction prompt
 * @param timeoutMs Maximum request timeout in milliseconds
 * @returns Generated response text or null if unavailable
 */
export async function callDeployedWorkerAPI(
  messages: LLMMessage[],
  systemPrompt: string | undefined,
  timeoutMs: number
): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload = {
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      systemPrompt,
    };
    const reqHeaders = { 'Content-Type': 'application/json' };
    const reqInit = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal,
    };
    const resp = await fetch('/api/ai', reqInit);

    if (!resp.ok) throw new Error('Worker AI HTTP ' + resp.status);
    const data = (await resp.json()) as { response?: string };
    return typeof data.response === 'string' ? data.response : null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls Cloudflare Workers AI REST API directly with Llama 3.3.
 *
 * @param messages Array of conversational LLM messages
 * @param config AI Orchestrator configuration with credentials
 * @returns Generated text response
 */
export async function callCloudflareWorkersAI(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = config.requestTimeoutMs || 9000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const model = '@cf/meta/llama-3.3-70b-instruct';
    const accountId = config.cloudflareAccountId || '';
    const url = 'https://api.cloudflare.com/client/v4/accounts/' + accountId + '/ai/run/' + model;
    const payload = {
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: 1024,
      temperature: 0.7,
    };

    const reqHeaders = {
      Authorization: 'Bearer ' + (config.cloudflareApiToken || ''),
      'Content-Type': 'application/json',
    };
    const reqInit = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal,
    };
    const resp = await fetch(url, reqInit);

    if (!resp.ok) throw new Error('Edge AI HTTP ' + resp.status);
    const data = (await resp.json()) as { result?: { response?: string } };
    const resText = data.result && data.result.response;
    if (!resText) throw new Error('Invalid response structure');
    return resText;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls Google Gemini REST API using the Gemini 2.5 Flash model.
 *
 * @param messages Array of conversational LLM messages
 * @param config AI Orchestrator configuration with credentials
 * @returns Generated text response
 */
export async function callGemini(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = config.requestTimeoutMs || 9000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const model = 'gemini-2.5-flash';
    const apiKey = config.geminiApiKey || '';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map(toGeminiContent);

    const systemMsg = messages.find((m) => m.role === 'system');
    const genConfig = { temperature: 0.7, maxOutputTokens: 1024 };
    const body: Record<string, unknown> = {
      contents,
      generationConfig: genConfig,
    };

    if (systemMsg) {
      body.systemInstruction = { parts: [toGeminiPart(systemMsg.content)] };
    }

    const reqHeaders = { 'Content-Type': 'application/json' };
    const reqInit = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(body),
      signal: controller.signal,
    };
    const resp = await fetch(url, reqInit);

    if (!resp.ok) throw new Error('Gemini HTTP ' + resp.status);
    const data = (await resp.json()) as GeminiApiResponse;

    const candidates = data.candidates;
    const parts = candidates && candidates[0] && candidates[0].content && candidates[0].content.parts;
    const reply = parts && parts[0] && parts[0].text;
    if (!reply) throw new Error('No candidate response');
    return reply;
  } finally {
    clearTimeout(timer);
  }
}
