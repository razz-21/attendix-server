import { getExpirationTimestamp } from "@/functions/get-expiration-timestamp.js";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { Context, Next } from "hono";
import { AUTH_COOKIES } from "@constants/auth.constant.js";
import { TokenPayload } from "@api/auth/auth.model.js";

export async function authMiddleware(c: Context, next: Next) {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    return c.json({ error: "Authentication secrets are not configured" }, 500);
  }

  const accessToken = getCookie(c, AUTH_COOKIES.ACCESS_TOKEN) ?? c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  const refreshToken = getCookie(c, AUTH_COOKIES.REFRESH_TOKEN)

  if (!accessToken && !refreshToken) {
    return c.json({ error: "Unauthorized: no active session" }, 401);
  }

  if (accessToken) {
    try {
      const accessPayload = await verifyToken(accessToken, accessTokenSecret);
      if (!isExpired(accessPayload.exp)) {
        c.set("user", accessPayload.user);
        await next();
        return;
      }
    } catch {
      if (!refreshToken) {
        return c.json({ error: "Session expired. Please sign in again." }, 401);
      }

      try {
        return await fallbackWithRefreshToken(c, next, refreshToken, accessTokenSecret, refreshTokenSecret);
      } catch {
        return c.json({ error: "Session expired. Please sign in again." }, 401);
      }
    }
  }

  if (!refreshToken) {
    return c.json({ error: "Session expired. Please sign in again." }, 401);
  }

  try {
    return await fallbackWithRefreshToken(c, next, refreshToken, accessTokenSecret, refreshTokenSecret);
  } catch {
    return c.json({ error: "Session expired. Please sign in again." }, 401);
  }
}

// Helper functions
function isExpired(exp: number): boolean {
  return exp <= Math.floor(Date.now() / 1000);
}

async function verifyToken(token: string, secret: string): Promise<TokenPayload> {
  const payload = await verify(token, secret, "HS256");
  return payload as TokenPayload;
}

async function fallbackWithRefreshToken(c: Context, next: Next, refreshToken: string, accessTokenSecret: string, refreshTokenSecret: string) {
  const refreshPayload = await verifyToken(refreshToken, refreshTokenSecret);

  if (isExpired(refreshPayload.exp)) {
    return c.json({ error: "Session expired. Please sign in again." }, 401);
  }

  const accessTokenExpiresInMinutes = Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES ?? "15");
  const newAccessPayload: TokenPayload = {
    user: refreshPayload.user,
    exp: getExpirationTimestamp(accessTokenExpiresInMinutes),
  };

  const newAccessToken = await sign(newAccessPayload, accessTokenSecret, "HS256");
  const isProduction = process.env.NODE_ENV === "production";

  setCookie(c, AUTH_COOKIES.ACCESS_TOKEN, newAccessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Strict",
    maxAge: accessTokenExpiresInMinutes * 60,
    path: "/",
  });

  c.set("user", refreshPayload.user);
  await next();
}