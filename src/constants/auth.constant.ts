import type { CookieOptions } from "hono/utils/cookie";

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