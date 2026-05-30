import { NextRequest } from "next/server";

// Cryptographic Session Signer & Verifier using Web Crypto API
// Compatible with both Node.js and Edge Runtime (Next.js Middleware)
export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const secret = process.env.ADMIN_PASSWORD || "roope_secure_default_secret_key_987654321";
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(timestamp)
  );
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signature = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return `${timestamp}:${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  
  const parts = token.split(":");
  if (parts.length !== 2) return false;
  
  const [timestamp, signature] = parts;
  const tokenTime = parseInt(timestamp, 10);
  
  // Expiration: 7 days
  if (isNaN(tokenTime) || Date.now() - tokenTime > 1000 * 60 * 60 * 24 * 7) {
    return false;
  }
  
  const secret = process.env.ADMIN_PASSWORD || "roope_secure_default_secret_key_987654321";
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const expectedBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(timestamp)
  );
  
  const expectedArray = Array.from(new Uint8Array(expectedBuffer));
  const expectedSignature = expectedArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  // Constant-time comparison to prevent timing attacks
  return safeCompare(signature, expectedSignature);
}

// Pure JS timing safe equal / constant-time string comparison
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Input Sanitization to prevent XSS
export function sanitizeString(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeString(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = sanitizeObject((obj as any)[key]);
      }
    }
    return newObj as T;
  }
  return obj;
}

// Token Bucket Rate Limiter
interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return req.ip || "127.0.0.1";
}

export function isRateLimited(ip: string, limit = 30, windowMs = 60000): boolean {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { tokens: limit, lastRefill: now };
    rateLimitMap.set(ip, record);
  }

  // Refill tokens
  const delta = now - record.lastRefill;
  const refill = delta * (limit / windowMs);
  record.tokens = Math.min(limit, record.tokens + refill);
  record.lastRefill = now;

  if (record.tokens >= 1) {
    record.tokens -= 1;
    return false; // Not rate limited
  }

  return true; // Rate limited
}
