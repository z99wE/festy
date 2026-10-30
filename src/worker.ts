export interface Env {
  AI?: {
    run: (model: string, options: Record<string, unknown>) => Promise<{ response?: string }>;
  };
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

interface MessageItem {
  role: string;
  content: string;
}

interface AiRequestBody {
  messages?: MessageItem[];
  prompt?: string;
  systemPrompt?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const DEFAULT_SYSTEM_PROMPT =
  'You are Festi AI, the world-class event architect and celebration intelligence assistant. You help users plan extraordinary weddings, milestone birthdays, corporate retreats, street festivals, dinner parties, and seasonal celebrations. Provide inspiring, actionable, step-by-step advice with timelines, sensory decor touches, and budget-saving recommendations. Strictly stay focused on celebrations, parties, hospitality, and event production. Writing format rules: Never use markdown bold or italic asterisks such as ** or *. Do not put asterisks anywhere in your answer. Use clean plain text with clear paragraph spacing and standard bullet points like • if needed.';

function cleanAiOutput(text?: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*/g, '')
    .trim();
}

function sanitizeWorkerInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .slice(0, 4000);
}

function buildMessages(body: AiRequestBody): MessageItem[] {
  const incoming = body.messages || [];
  const systemPrompt = body.systemPrompt ? sanitizeWorkerInput(body.systemPrompt) : DEFAULT_SYSTEM_PROMPT;
  const list: MessageItem[] = [{ role: 'system', content: systemPrompt }];

  for (const m of incoming) {
    if (m.content) {
      list.push({ role: m.role || 'user', content: sanitizeWorkerInput(m.content) });
    }
  }

  if (body.prompt && incoming.length === 0) {
    list.push({ role: 'user', content: sanitizeWorkerInput(body.prompt) });
  }

  if (list.length === 1 && !body.prompt) {
    list.push({ role: 'user', content: 'Hello Festi AI! How can you help me plan my celebration?' });
  }

  return list;
}

async function executeModelRun(env: Env, messages: MessageItem[]): Promise<Response> {
  if (!env.AI) {
    return new Response(
      JSON.stringify({ error: 'Workers AI binding not available', fallbackNeeded: true }),
      { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const aiResult = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages,
      max_tokens: 1200,
      temperature: 0.7,
    });
    return new Response(
      JSON.stringify({
        response: cleanAiOutput(aiResult.response),
        provider: 'Edge AI (Llama 3.3 70B)',
        model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (llamaErr) {
    console.warn('Llama 3.3 failed, falling back to Llama 3.1 8B:', llamaErr);
    const fallback = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });
    return new Response(
      JSON.stringify({
        response: cleanAiOutput(fallback.response),
        provider: 'Edge AI (Fast Fallback)',
        model: '@cf/meta/llama-3.1-8b-instruct-fp8',
      }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleAiRequest(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
  }

  try {
    const body = (await request.json()) as AiRequestBody;
    const messages = buildMessages(body);
    return await executeModelRun(env, messages);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message, fallbackNeeded: true }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/ai') {
      return handleAiRequest(request, env);
    }
    if (url.pathname === '/api/auth/session') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
      }
      return new Response(
        JSON.stringify({
          authenticated: true,
          scope: 'festiya.viktorechakraborty.workers.dev',
          edgeTenant: 'festiya-isolated-v1',
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    return env.ASSETS.fetch(request);
  },
};
