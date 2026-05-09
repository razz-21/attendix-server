import { z } from "@hono/zod-openapi";

export const ForgotPasswordStatusEnum = z.enum(["Active", "Verified"]);

export const ForgotPasswordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string(),
  token: z.string(),
  status: ForgotPasswordStatusEnum,
  expired_in: z.date(),
  created_at: z.date(),
});

export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email().openapi({
    description: 'The email address of the user requesting a password reset',
    example: 'user@example.com',
  }),
}).openapi('ForgotPasswordRequest');

export const VerifyTokenRequestSchema = z.object({
  token: z.string().openapi({
    description: 'The password reset token',
    example: 'ey...',
  }),
}).openapi('VerifyTokenRequest');

export const ResetPasswordRequestSchema = z.object({
  token: z.string().openapi({
    description: 'The password reset token',
    example: 'ey...',
  }),
  password: z.string().min(8).openapi({
    description: 'The new password',
    example: 'new_secure_password',
  }),
}).openapi('ResetPasswordRequest');
