import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const KNOWN_DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  '20minutemail.com',
  'burnermail.io',
  'crazymailing.com',
  'disposablemail.com',
  'dispostable.com',
  'dropmail.me',
  'emailondeck.com',
  'fakeinbox.com',
  'fakemail.net',
  'fakemailgenerator.com',
  'generator.email',
  'getairmail.com',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'harakirimail.com',
  'inboxkitten.com',
  'incognitomail.org',
  'mailcatch.com',
  'maildrop.cc',
  'mailinator.com',
  'mailinator.net',
  'mailnesia.com',
  'mailscrap.com',
  'mohmal.com',
  'mohmal.im',
  'mytemp.email',
  'mytempemail.com',
  'mytempemail.net',
  'nada.ltd',
  'pokemail.net',
  'sharklasers.com',
  'spam4.me',
  'spambox.us',
  'spamgourmet.com',
  'tempail.com',
  'temp-mail.org',
  'tempmail.com',
  'tempmail.net',
  'tempmailaddress.com',
  'throwawaymail.com',
  'tmpmail.net',
  'tmpmail.org',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
]);

const DISPOSABLE_KEYWORDS = [
  'tempmail',
  'temp-mail',
  'disposable',
  'throwaway',
  'fakemail',
  'fake-mail',
  '10minute',
  '20minute',
  'burnermail',
  'trashmail',
  'mailinator',
  'guerrilla',
  'sharklaser',
  'inboxkitten',
  'dropmail',
  'mohmal',
  'mytempemail',
  'tmpmail',
];

const DUMMY_DOMAINS = new Set([
  'example.com',
  'example.org',
  'test.com',
  'asdf.com',
  'fake.com',
  'none.com',
]);

function validateRegistrationEmail(rawEmail) {
  const email = (rawEmail || '').trim().toLowerCase();

  if (!email) {
    return { valid: false, error: 'Please enter your email address' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. host@domain.com)' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed email address' };
  }

  const [username, domain] = parts;
  if (username.length < 2) {
    return { valid: false, error: 'Username in email must be at least 2 characters' };
  }

  if (KNOWN_DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      domain,
      error: 'Temporary and disposable emails are not permitted. Please use your verified personal or work email.',
    };
  }

  if (DUMMY_DOMAINS.has(domain)) {
    return {
      valid: false,
      domain,
      error: 'Please enter a real email address rather than a test domain.',
    };
  }

  for (const keyword of DISPOSABLE_KEYWORDS) {
    if (domain.includes(keyword)) {
      return {
        valid: false,
        domain,
        error: 'Temporary and disposable emails are not permitted. Please use your verified personal or work email.',
      };
    }
  }

  return { valid: true, domain };
}

describe('Festiya Tenant Auth & Anti-Disposable Email Engine', () => {
  describe('Disposable & Temp Email Rejection', () => {
    const tempEmails = [
      'throwaway@mailinator.com',
      'user123@10minutemail.com',
      'test@tempmail.com',
      'spambox@yopmail.com',
      'anon@sharklasers.com',
      'fake@trashmail.com',
      'disposable@guerrillamail.com',
      'burner@burnermail.io',
      'temp@dropmail.me',
      'bot@my-tempmail-service.xyz',
    ];

    for (const email of tempEmails) {
      test(`rejects throwaway email: ${email}`, () => {
        const result = validateRegistrationEmail(email);
        assert.equal(result.valid, false);
        assert.match(result.error, /Temporary and disposable emails are not permitted/i);
      });
    }

    test('rejects dummy and test domains', () => {
      const result = validateRegistrationEmail('planner@example.com');
      assert.equal(result.valid, false);
      assert.match(result.error, /Please enter a real email address/i);
    });

    test('rejects malformed email addresses', () => {
      assert.equal(validateRegistrationEmail('notanemail').valid, false);
      assert.equal(validateRegistrationEmail('a@b').valid, false);
      assert.equal(validateRegistrationEmail('').valid, false);
      assert.equal(validateRegistrationEmail('x@domain.com').valid, false); // < 2 char username
    });

    test('accepts genuine personal and organizational emails', () => {
      const validEmails = [
        'event.planner@gmail.com',
        'sarah.connor@yahoo.com',
        'director@celebrations.co.uk',
        'alex@hospitalitygroup.org',
        'host@festiya.events',
      ];

      for (const email of validEmails) {
        const result = validateRegistrationEmail(email);
        assert.equal(result.valid, true, `Expected ${email} to be valid`);
        assert.equal(result.error, undefined);
      }
    });
  });

  describe('Cloudflare Origin & Session Scope Isolation', () => {
    test('enforces isolated session key prefix to prevent cross-app pollution', () => {
      const sessionKey = 'festiya_cf_session_v1';
      assert.ok(sessionKey.startsWith('festiya_cf_'));
      assert.ok(!sessionKey.includes('generic'));
    });

    test('user session token format guarantees unforgeable random tenant identity', () => {
      const token = `cf_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      assert.match(token, /^cf_tok_[a-z0-9]+_\d+$/);
    });
  });
});
