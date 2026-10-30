/**
 * Disposable & Temporary Email Detection Engine.
 * Protects Festiya against throwaway mail providers, spam bots, and unverified ephemeral addresses.
 */

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

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  domain?: string;
}

/**
 * Validates whether an email is properly formed and NOT from a disposable/temp service.
 */
export function validateRegistrationEmail(rawEmail: string): EmailValidationResult {
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
