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
    if (url.pathname === '/api/ai' && request.method === 'POST') {
      try {
        const body = (await request.json()) as {
          messages?: Array<{ role: string; content: string }>;
          systemPrompt?: string;
        };

        const incomingMessages = body.messages || [];
        const systemPrompt = body.systemPrompt;

        const messages: Array<{ role: string; content: string }> = [];
        if (systemPrompt) {
          messages.push({ role: 'system', content: systemPrompt });
        }
        for (const m of incomingMessages) {
          messages.push({ role: m.role, content: m.content });
        }

        if (!env.AI) {
          return new Response(
            JSON.stringify({
              error: 'Workers AI binding not available',
              fallbackNeeded: true,
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Try primary model: Llama 3.3 70B Instruct Fast
        try {
          const aiResult = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages,
            max_tokens: 1200,
            temperature: 0.7,
          });

          return new Response(
            JSON.stringify({
              response: aiResult.response,
              provider: 'Cloudflare Workers AI',
              model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
        } catch (llamaErr) {
          // Failover to secondary fast model: Llama 3.1 8B Instruct FP8
          console.warn('Llama 3.3 failed in Worker, failing over to 8B:', llamaErr);
          const fallbackAiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
            messages,
            max_tokens: 1024,
            temperature: 0.7,
          });

          return new Response(
            JSON.stringify({
              response: fallbackAiResult.response,
              provider: 'Cloudflare Workers AI (Fast Fallback)',
              model: '@cf/meta/llama-3.1-8b-instruct-fp8',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Serve static assets from ./dist
    return env.ASSETS.fetch(request);
  },
};
