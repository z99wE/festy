export interface Env {
  AI?: {
    run: (model: string, options: Record<string, unknown>) => Promise<{ response?: string }>;
  };
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle AI completions via Cloudflare Workers AI
    if (url.pathname === '/api/ai') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.method === 'POST') {
        try {
          const body = (await request.json()) as {
            messages?: Array<{ role: string; content: string }>;
            prompt?: string;
            systemPrompt?: string;
          };

          const incomingMessages = body.messages || [];
          const systemPrompt =
            body.systemPrompt ||
            'You are Festi AI, the world-class event architect and celebration intelligence assistant. You help users plan extraordinary weddings, milestone birthdays, corporate retreats, street festivals, dinner parties, and seasonal celebrations. Provide inspiring, actionable, step-by-step advice with timelines, sensory decor touches, and budget-saving recommendations. Strictly stay focused on celebrations, parties, hospitality, and event production. Writing format rules: Never use markdown bold or italic asterisks such as ** or *. Do not put asterisks anywhere in your answer. Use clean plain text with clear paragraph spacing and standard bullet points like • if needed.';

          const messages: Array<{ role: string; content: string }> = [
            { role: 'system', content: systemPrompt },
          ];

          for (const m of incomingMessages) {
            if (m.content) {
              messages.push({ role: m.role || 'user', content: m.content });
            }
          }

          if (body.prompt && incomingMessages.length === 0) {
            messages.push({ role: 'user', content: body.prompt });
          }

          if (messages.length === 1 && !body.prompt) {
            messages.push({ role: 'user', content: 'Hello Festi AI! How can you help me plan my celebration?' });
          }

          if (!env.AI) {
            return new Response(
              JSON.stringify({
                error: 'Workers AI binding not available',
                fallbackNeeded: true,
              }),
              {
                status: 503,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }

          const cleanAiOutput = (text?: string): string => {
            if (!text) return '';
            return text
              .replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/\*(.*?)\*/g, '$1')
              .replace(/^\s*\*\s+/gm, '• ')
              .replace(/\*/g, '')
              .trim();
          };

          // Try primary model: Llama 3.3 70B Instruct Fast
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
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          } catch (llamaErr) {
            console.warn('Llama 3.3 failed, falling back to Llama 3.1 8B:', llamaErr);
            const fallbackAiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
              messages,
              max_tokens: 1024,
              temperature: 0.7,
            });

            return new Response(
              JSON.stringify({
                response: cleanAiOutput(fallbackAiResult.response),
                provider: 'Edge AI (Fast Fallback)',
                model: '@cf/meta/llama-3.1-8b-instruct-fp8',
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          return new Response(
            JSON.stringify({
              error: message,
              fallbackNeeded: true,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }

    // Serve static assets from ./dist
    return env.ASSETS.fetch(request);
  },
};
