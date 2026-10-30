import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

function sanitizeWorkerInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .slice(0, 4000);
}

function cleanAiOutput(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*/g, '')
    .trim();
}

function buildMessages(body) {
  const incoming = body.messages || [];
  const systemPrompt = body.systemPrompt ? sanitizeWorkerInput(body.systemPrompt) : 'Default Prompt';
  const list = [{ role: 'system', content: systemPrompt }];

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

describe('Cloudflare Worker Edge Intelligence Engine', () => {
  describe('Input Sanitization & Boundary Defense', () => {
    test('strips null bytes from user input payloads', () => {
      const malicious = 'Planning a party\0with inject\0attempt';
      assert.equal(sanitizeWorkerInput(malicious), 'Planning a partywith injectattempt');
    });

    test('strips zero-width unicode characters and hidden bytes', () => {
      const hidden = 'Wedding\u200BPlan\uFEFFBudget\u200C';
      assert.equal(sanitizeWorkerInput(hidden), 'WeddingPlanBudget');
    });

    test('strips inline executable script tags and preserves inner intent', () => {
      const payload = 'Birthday Party <script>alert("xss")</script> for 50 guests';
      assert.equal(sanitizeWorkerInput(payload), 'Birthday Party  for 50 guests');
    });

    test('clamps overly large input bodies to 4000 character ceiling', () => {
      const longInput = 'A'.repeat(5000);
      const sanitized = sanitizeWorkerInput(longInput);
      assert.equal(sanitized.length, 4000);
    });
  });

  describe('AI Output Post-Processing & Asterisk Elimination', () => {
    test('removes bold markdown asterisks while retaining readable content', () => {
      const raw = 'Here is your **Conservative Budget** for the reception.';
      assert.equal(cleanAiOutput(raw), 'Here is your Conservative Budget for the reception.');
    });

    test('removes italic markdown asterisks cleanly', () => {
      const raw = 'Remember to *verify sound permits* with the local council.';
      assert.equal(cleanAiOutput(raw), 'Remember to verify sound permits with the local council.');
    });

    test('converts asterisk bullet points into clean bullet characters', () => {
      const raw = '* Hire DJ\n* Order cake\n* Confirm venue';
      const cleaned = cleanAiOutput(raw);
      assert.ok(cleaned.includes('• Hire DJ'));
      assert.ok(cleaned.includes('• Order cake'));
      assert.ok(cleaned.includes('• Confirm venue'));
      assert.ok(!cleaned.includes('*'));
    });
  });

  describe('Message Hierarchy & Fallback Assembly', () => {
    test('constructs system prompt and single prompt message', () => {
      const messages = buildMessages({ prompt: 'Plan my 30th birthday' });
      assert.equal(messages.length, 2);
      assert.equal(messages[0].role, 'system');
      assert.equal(messages[1].role, 'user');
      assert.equal(messages[1].content, 'Plan my 30th birthday');
    });

    test('constructs conversation history when messages array is provided', () => {
      const messages = buildMessages({
        messages: [
          { role: 'user', content: 'What about catering?' },
          { role: 'assistant', content: 'Consider a buffet style.' },
          { role: 'user', content: 'Can we add dietary flags?' },
        ],
      });
      assert.equal(messages.length, 4); // 1 system + 3 history
      assert.equal(messages[3].content, 'Can we add dietary flags?');
    });

    test('supplies graceful conversational default when body is completely empty', () => {
      const messages = buildMessages({});
      assert.equal(messages.length, 2);
      assert.match(messages[1].content, /Hello Festi AI/i);
    });
  });
});
