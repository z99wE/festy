import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

function sanitizeStrictInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
    .slice(0, 4000);
}

function detectSqlInjection(input) {
  const sqlPatterns = [
    /(\b(union(\s+all)?)\b.+\bselect\b)/i,
    /(\b(select|insert|update|delete|drop|alter)\b.+\b(from|into|table|database)\b)/i,
    /('|")?\s*(or|and)\s+('?1'?\s*=\s*'?1'?|true)/i,
    /--\s*$/m,
    /;\s*(drop|delete|update)\b/i,
  ];
  return sqlPatterns.some((pattern) => pattern.test(input));
}

function detectPathTraversal(input) {
  const traversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e\//i,
    /\.\.%2f/i,
    /\/etc\/passwd/i,
    /c:\\windows\\system32/i,
  ];
  return traversalPatterns.some((pattern) => pattern.test(input));
}

function detectCrlfInjection(input) {
  return /[\r\n]/.test(input);
}

class SlidingWindowRateLimiter {
  constructor(limit = 40, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  isAllowed(ip, currentTime = Date.now()) {
    const record = this.clients.get(ip);
    if (!record || currentTime > record.resetAt) {
      this.clients.set(ip, { count: 1, resetAt: currentTime + this.windowMs });
      return true;
    }
    if (record.count >= this.limit) {
      return false;
    }
    record.count++;
    return true;
  }
}

describe('Advanced Edge Security & Exploit Defense Suite', () => {
  describe('Cross-Site Scripting (XSS) Sanitization Matrix', () => {
    test('neutralizes inline script tags with nested whitespace', () => {
      const malicious = '<script type="text/javascript"> alert(document.cookie); </script>';
      assert.equal(sanitizeStrictInput(malicious), '');
    });

    test('strips malicious SVG onload event handlers', () => {
      const payload = '<svg onload="alert(1)">Decor Idea</svg>';
      const sanitized = sanitizeStrictInput(payload);
      assert.ok(!sanitized.includes('onload='));
    });

    test('strips img onerror event handlers', () => {
      const payload = '<img src="x" onerror="stealTokens()">Cake Idea';
      const sanitized = sanitizeStrictInput(payload);
      assert.ok(!sanitized.includes('onerror='));
    });

    test('strips iframe and embedded frame tags', () => {
      const payload = '<iframe src="https://attacker.com/exploit"></iframe>Wedding Details';
      const sanitized = sanitizeStrictInput(payload);
      assert.equal(sanitized, 'Wedding Details');
    });

    test('strips javascript: pseudo-protocol links', () => {
      const payload = '<a href="javascript:alert(1)">Click for Menu</a>';
      const sanitized = sanitizeStrictInput(payload);
      assert.ok(!sanitized.toLowerCase().includes('javascript:'));
    });
  });

  describe('SQL & Command Injection Signature Detection', () => {
    test('intercepts classic OR 1=1 boolean injection', () => {
      assert.ok(detectSqlInjection("' OR '1'='1"));
      assert.ok(detectSqlInjection("admin' OR 1=1 --"));
    });

    test('intercepts UNION SELECT database enumeration attempts', () => {
      assert.ok(detectSqlInjection("' UNION SELECT username, password FROM users --"));
    });

    test('intercepts DROP TABLE and destructive queries', () => {
      assert.ok(detectSqlInjection("; DROP TABLE events;"));
      assert.ok(detectSqlInjection("1; DELETE FROM bookings;"));
    });

    test('allows legitimate natural language planning queries mentioning normal words', () => {
      assert.equal(detectSqlInjection("Select the best floral arches for my wedding"), false);
      assert.equal(detectSqlInjection("Drop off the guest gifts at the reception hall"), false);
      assert.equal(detectSqlInjection("Update our guest count to 150"), false);
    });
  });

  describe('Path Traversal & Local File Inclusion (LFI) Detection', () => {
    test('flags relative dot-dot-slash directory traversal', () => {
      assert.ok(detectPathTraversal("../../../etc/passwd"));
      assert.ok(detectPathTraversal("..\\..\\windows\\system32"));
    });

    test('flags URL encoded path traversal representations', () => {
      assert.ok(detectPathTraversal("%2e%2e%2fconfig.json"));
      assert.ok(detectPathTraversal("..%2fprivate_key.pem"));
    });

    test('allows normal safe relative asset paths', () => {
      assert.equal(detectPathTraversal("/assets/festiya-logo.webp"), false);
      assert.equal(detectPathTraversal("images/weddings/gallery.jpg"), false);
    });
  });

  describe('CRLF Header Injection & Smuggling Guard', () => {
    test('identifies carriage return and newline characters in header candidates', () => {
      assert.ok(detectCrlfInjection("admin\r\nSet-Cookie: session=hijacked"));
      assert.ok(detectCrlfInjection("token\nTransfer-Encoding: chunked"));
    });

    test('passes clean, single-line tokens and strings', () => {
      assert.equal(detectCrlfInjection("festiya-events-tenant-v1"), false);
      assert.equal(detectCrlfInjection("cf_tok_abcdef123456_1730000000"), false);
    });
  });

  describe('Sliding Window Rate Limiter Engine', () => {
    test('permits requests within limit threshold', () => {
      const limiter = new SlidingWindowRateLimiter(5, 10000);
      const ip = '192.168.1.100';
      for (let i = 0; i < 5; i++) {
        assert.ok(limiter.isAllowed(ip));
      }
    });

    test('blocks subsequent requests exceeding limit ceiling', () => {
      const limiter = new SlidingWindowRateLimiter(5, 10000);
      const ip = '192.168.1.100';
      for (let i = 0; i < 5; i++) {
        limiter.isAllowed(ip);
      }
      assert.equal(limiter.isAllowed(ip), false);
      assert.equal(limiter.isAllowed(ip), false);
    });

    test('maintains strict isolation between disparate client IPs', () => {
      const limiter = new SlidingWindowRateLimiter(3, 10000);
      const ipA = '10.0.0.1';
      const ipB = '10.0.0.2';

      for (let i = 0; i < 3; i++) {
        limiter.isAllowed(ipA);
      }
      // IP A is exhausted
      assert.equal(limiter.isAllowed(ipA), false);

      // IP B must remain unaffected
      assert.ok(limiter.isAllowed(ipB));
      assert.ok(limiter.isAllowed(ipB));
      assert.ok(limiter.isAllowed(ipB));
      assert.equal(limiter.isAllowed(ipB), false);
    });

    test('resets quota automatically when time window expires', () => {
      const limiter = new SlidingWindowRateLimiter(2, 5000);
      const ip = '172.16.0.5';
      const startTime = 1000000;

      assert.ok(limiter.isAllowed(ip, startTime));
      assert.ok(limiter.isAllowed(ip, startTime + 1000));
      assert.equal(limiter.isAllowed(ip, startTime + 2000), false);

      // Advance clock past 5000ms window
      const futureTime = startTime + 6000;
      assert.ok(limiter.isAllowed(ip, futureTime));
    });
  });
});
