import type { CookieOptions } from "hono/utils/cookie";
import { rateLimiter } from 'hono-rate-limiter';

export const AUTH_COOKIES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export function getAuthCookieOptions(maxAge?: number): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}

export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: 'draft-6',
  keyGenerator: async (c) => {
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      c.req.header('x-real-ip') ??
      'unknown';
    const email = (await c.req.json().catch(() => ({})))?.email; // only if body is small & you parse once
    return email ? `${ip}:${email}` : ip;
  },
});