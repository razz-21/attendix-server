import { z } from "@hono/zod-openapi";
import { UserSchema } from "../users/users.model.js";

export const TokenPayloadSchema = z.object({
  user: UserSchema.omit({ password: true }).openapi('User'),
  exp: z.number('Expires in is required').openapi({
    description: 'The expiration time of the token',
  }),
  refresh_exp: z.number('Refresh expires in is required').openapi({
    description: 'The expiration time of the refresh token',
  }),
}).openapi('TokenPayload');

export const EmailLoginSchema = z.object({
  email: z.string()
  .optional()
  .openapi({
      description: 'The email of the user',
  }),
  username: z.string()
  .trim()
  .optional()
  .openapi({
      description: 'The username of the user',
  }),
  password: z.string().openapi({
      description: 'The password of the user',
  }),
}).openapi('EmailLogin');

export const EmailLoginResponseSchema = z.object({
  access_token: z.string('Token is required').openapi({
    description: 'The access token of the user',
  }),
  refresh_token: z.string('Refresh token is required').openapi({
    description: 'The refresh token of the user',
  }),
  payload: TokenPayloadSchema.openapi('Payload'),
}).openapi('EmailLoginResponse');

export const PostRequestAccountSchema = UserSchema.pick({
  id: true,
  rfid: true,
  firstname: true,
  lastname: true,
  email: true,
  department: true,
  username: true,
  password: true,
}).openapi('PostRequestAccount');

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type EmailLogin = z.infer<typeof EmailLoginSchema>;
export type EmailLoginResponse = z.infer<typeof EmailLoginResponseSchema>;
export type PostRequestAccount = z.infer<typeof PostRequestAccountSchema>;