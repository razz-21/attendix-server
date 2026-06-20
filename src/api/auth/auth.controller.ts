import { EmailLogin, EmailLoginResponse, EmailLoginSchema } from "./auth.model.js";
import { Context } from "hono";
import { ZodError } from "zod";
import { getUserByEmailOrUsername, isUserPasswordValid, signAccessToken, signRefreshToken } from "./auth.service.js";
import { getExpirationTimestamp } from "../../functions/get-expiration-timestamp.js";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIES, getAuthCookieOptions } from "../../constants/auth.constant.js";

export async function emailLogin(c: Context) {
  try {
    const payload = EmailLoginSchema.parse(await c.req.json<EmailLogin>());

    if (!payload.email && !payload.username) {
      return c.json({ error: 'Email or username is required' }, 400);
    }

    const user = await getUserByEmailOrUsername(payload.email, payload.username);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const isPasswordValid = await isUserPasswordValid(payload.password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const accessTokenExpiresInMinutes = Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES ?? "15");
    const refreshTokenExpiresInMinutes = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_MINUTES ?? "10080");
    const accessTokenExp = getExpirationTimestamp(accessTokenExpiresInMinutes);
    const refreshTokenExp = getExpirationTimestamp(refreshTokenExpiresInMinutes);

    const accessPayload = {
      user: user,
      exp: accessTokenExp,
      refresh_exp: refreshTokenExp,
    };
    const refreshPayload = {
      user: user,
      exp: refreshTokenExp,
      refresh_exp: refreshTokenExp,
    };

    const accessToken = await signAccessToken(accessPayload);
    const refreshToken = await signRefreshToken(refreshPayload);

    setCookie(c, AUTH_COOKIES.ACCESS_TOKEN, accessToken, getAuthCookieOptions(accessTokenExpiresInMinutes * 60));
    setCookie(c, AUTH_COOKIES.REFRESH_TOKEN, refreshToken, getAuthCookieOptions(refreshTokenExpiresInMinutes * 60));

    const loginResponse: EmailLoginResponse = {
      access_token: accessToken,
      refresh_token: refreshToken,
      payload: accessPayload,
    };

    return c.json(loginResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function emailLogout(c: Context) {
  try {
    const cookieOpts = getAuthCookieOptions();
    deleteCookie(c, AUTH_COOKIES.ACCESS_TOKEN, cookieOpts);
    deleteCookie(c, AUTH_COOKIES.REFRESH_TOKEN, cookieOpts);
    return c.json({ message: 'Successfully logged out' }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to logout' }, 500);
  }
}