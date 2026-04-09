import { EmailLogin, EmailLoginResponse, EmailLoginSchema } from "./auth.model.js";
import { Context } from "hono";
import { ZodError } from "zod";
import { getUserByEmailOrUsername, isUserPasswordValid, signAccessToken, signRefreshToken } from "./auth.service.js";
import { getExpirationTimestamp } from "@functions/get-expiration-timestamp.js";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIES } from "@constants/auth.constant.js";

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

    const userPayload = {
      user: user,
      exp: getExpirationTimestamp(Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES ?? "15")),
    };
    const accessToken = await signAccessToken(userPayload);
    const refreshToken = await signRefreshToken(userPayload);

    const accessTokenExpiresInMinutes = Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES ?? "15");
    const refreshTokenExpiresInMinutes = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_MINUTES ?? "10080");
    const isProduction = process.env.NODE_ENV === "production";

    setCookie(c, AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Strict",
      maxAge: accessTokenExpiresInMinutes * 60,
      path: "/",
    });

    setCookie(c, AUTH_COOKIES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Strict",
      maxAge: refreshTokenExpiresInMinutes * 60,
      path: "/",
    });

    const loginResponse: EmailLoginResponse = {
      access_token: accessToken,
      refresh_token: refreshToken,
      payload: userPayload,
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
    deleteCookie(c, AUTH_COOKIES.ACCESS_TOKEN);
    deleteCookie(c, AUTH_COOKIES.REFRESH_TOKEN);
    return c.json({ message: 'Successfully logged out' }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to logout' }, 500);
  }
}