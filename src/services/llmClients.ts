import type { LLMMessage, LLMConfig } from './aiOrchestrator';

export {
  callDeployedWorkerAPI,
  callCloudflareWorkersAI,
  callGemini,
} from './llmEdgeClients';

interface ChatChoice {
  message?: { content?: string };
}

interface ChatApiResponse {
  choices?: ChatChoice[];
}

interface AnthropicContentBlock {
  text?: string;
}

interface AnthropicApiResponse {
  content?: AnthropicContentBlock[];
}

/**
 * Calls Groq Cloud AI inference API using the Llama 3.3 model.
 *
 * @param messages Array of conversational LLM messages
 * @param config AI Orchestrator configuration with credentials
 * @returns Generated text response
 */
export async function callGroq(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = config.requestTimeoutMs || 9000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const candidateModels = [
    'llama-3.3-70b-versatile',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
  ];

  try {
    const reqHeaders = {
      Authorization: 'Bearer ' + (config.groqApiKey || ''),
      'Content-Type': 'application/json',
    };

    let lastError: Error | null = null;

    for (const model of candidateModels) {
      try {
        const payload = {
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        };
        const reqInit = {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(payload),
          signal: controller.signal,
        };
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', reqInit);

        if (resp.status === 404 || resp.status === 400) {
          const errData = (await resp.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
          if (errData.error?.code === 'model_not_found' || errData.error?.message?.includes('does not exist')) {
            lastError = new Error(errData.error.message);
            continue;
          }
          throw new Error('Groq HTTP ' + resp.status + ': ' + (errData.error?.message || 'Bad Request'));
        }

        if (!resp.ok) throw new Error('Groq HTTP ' + resp.status);
        const data = (await resp.json()) as ChatApiResponse & { choices?: Array<{ message?: { reasoning?: string } }> };
        const choices = data.choices;
        const msg = choices && choices[0] && choices[0].message;
        const content = msg?.content || msg?.reasoning;
        if (!content) throw new Error('Empty response from Groq');
        return content;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') throw err;
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError || new Error('Groq all candidate models exhausted');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls OpenAI REST API using GPT-4o-mini.
 *
 * @param messages Array of conversational LLM messages
 * @param config AI Orchestrator configuration with credentials
 * @returns Generated text response
 */
export async function callOpenAI(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = config.requestTimeoutMs || 9000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload = {
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    };
    const reqHeaders = {
      Authorization: 'Bearer ' + (config.openaiApiKey || ''),
      'Content-Type': 'application/json',
    };
    const reqInit = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal,
    };
    const resp = await fetch('https://api.openai.com/v1/chat/completions', reqInit);

    if (!resp.ok) throw new Error('OpenAI HTTP ' + resp.status);
    const data = (await resp.json()) as ChatApiResponse;
    const choices = data.choices;
    const content = choices && choices[0] && choices[0].message && choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls Anthropic Messages API using Claude 3.5 Haiku.
 *
 * @param messages Array of conversational LLM messages
 * @param config AI Orchestrator configuration with credentials
 * @returns Generated text response
 */
export async function callAnthropic(
  messages: LLMMessage[],
  config: LLMConfig
): Promise<string> {
  const controller = new AbortController();
  const timeoutMs = config.requestTimeoutMs || 9000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const systemMsg = messages.find((m) => m.role === 'system');
    const nonSystemMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const payload = {
      model: 'claude-3-5-haiku-20241022',
      system: systemMsg ? systemMsg.content : undefined,
      messages: nonSystemMessages,
      max_tokens: 1024,
    };
    const reqHeaders = {
      'x-api-key': config.anthropicApiKey || '',
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      'dangerously-allow-browser': 'true',
    };
    const reqInit = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(payload),
      signal: controller.signal,
    };
    const resp = await fetch('https://api.anthropic.com/v1/messages', reqInit);

    if (!resp.ok) throw new Error('Anthropic HTTP ' + resp.status);
    const data = (await resp.json()) as AnthropicApiResponse;
    const contentList = data.content;
    const content = contentList && contentList[0] && contentList[0].text;
    if (!content) throw new Error('Empty response from Anthropic');
    return content;
  } finally {
    clearTimeout(timer);
  }
}
