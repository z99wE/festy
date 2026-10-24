/**
 * Festiya Cloudflare-Native Authentication & Cryptographic Service
 * Uses standard Web Crypto (crypto.subtle) native to Cloudflare Workers.
 */

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH_BITS = 256;
const JWT_SECRET_DEFAULT = "festiya-cloud-secret-key-32-bytes-minimum";

// Helper: Convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

// Helper: Convert Hex String to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Base64Url encode/decode for JWT
function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

/**
 * Hashes a plaintext password using PBKDF2 + SHA-256.
 */
export async function hashPassword(
  password: string,
  saltHex?: string
): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    KEY_LENGTH_BITS
  );

  return {
    hash: bufferToHex(derivedBits),
    salt: bufferToHex(salt.buffer as ArrayBuffer),
  };
}

/**
 * Verifies a plaintext password against a stored hash and salt.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  saltHex: string
): Promise<boolean> {
  const { hash } = await hashPassword(password, saltHex);
  return hash === storedHash;
}

/**
 * Creates an HMAC-SHA256 signed JWT token valid for 7 days.
 */
export async function createSessionToken(
  payload: { userId: string; email: string },
  secret: string = JWT_SECRET_DEFAULT
): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 7 * 86400; // 7 days

  const tokenPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const message = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signatureBuffer))
  );

  return `${message}.${encodedSignature}`;
}

/**
 * Verifies an HMAC-SHA256 signed JWT token.
 */
export async function verifySessionToken(
  token: string,
  secret: string = JWT_SECRET_DEFAULT
): Promise<{ userId: string; email: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Uint8Array.from(base64UrlDecode(encodedSignature), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(message));

    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
