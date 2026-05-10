import { Context } from "hono";
import { ForgotPasswordRequestSchema, ResetPasswordRequestSchema, VerifyTokenRequestSchema } from "./forgot-password.model.js";
import { createForgotPasswordRecord, resetUserPassword, verifyForgotPasswordToken } from "./forgot-password.service.js";

export const requestPasswordReset = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = ForgotPasswordRequestSchema.safeParse(body);
    
    if (!result.success) {
      return c.json({ error: "Invalid request format", details: result.error.issues }, 400);
    }

    await createForgotPasswordRecord(result.data.email);

    return c.json({ message: "Check your email for instructions to reset your password." }, 200);
  } catch (error: any) {
    if (error.message === "this email does not exist") {
      return c.json({ error: error.message }, 404);
    }
    console.error("Error in requestPasswordReset:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const verifyToken = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = VerifyTokenRequestSchema.safeParse(body);

    if (!result.success) {
      return c.json({ error: "Invalid token format" }, 400);
    }

    const { valid } = await verifyForgotPasswordToken(result.data.token);

    if (!valid) {
      return c.json({ error: "Invalid or expired token" }, 400);
    }

    return c.json({ message: "Token is valid" }, 200);
  } catch (error: any) {
    console.error("Error in verifyToken:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const resetPassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = ResetPasswordRequestSchema.safeParse(body);

    if (!result.success) {
      return c.json({ error: "Invalid request format", details: result.error.issues }, 400);
    }

    await resetUserPassword(result.data.token, result.data.password);

    return c.json({ message: "Password has been successfully reset" }, 200);
  } catch (error: any) {
    console.error("Error in resetPassword:", error);
    if (error.message === "Invalid or expired token") {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
};
