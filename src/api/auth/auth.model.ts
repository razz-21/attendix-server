import { z } from "@hono/zod-openapi";
import { UserSchema } from "../users/users.model";

export const TokenPayloadSchema = z.object({
  user: UserSchema.omit({ password: true }).openapi('User'),
  exp: z.number('Expires in is required').openapi({
    description: 'The expiration time of the token',
    example: 15,
  }),
}).openapi('TokenPayload');

export const EmailLoginSchema = z.object({
  email: z.string('Email is required')
  .pipe(z.email('Invalid email'))
  .optional()
  .openapi({
      description: 'The email of the user',
      example: 'john.doe@example.com',
  }),
  username: z.string('Username is required')
  .trim()
  .min(1, 'Username is required')
  .optional()
  .openapi({
      description: 'The username of the user',
      example: 'john.doe',
  }),
  password: z.string().min(8).openapi({
      description: 'The password of the user',
      example: 'password',
  }),
}).openapi('EmailLogin');

export const EmailLoginResponseSchema = z.object({
  access_token: z.string('Token is required').openapi({
    description: 'The access token of the user',
    example: 'token',
  }),
  refresh_token: z.string('Refresh token is required').openapi({
    description: 'The refresh token of the user',
    example: 'refresh_token',
  }),
  payload: TokenPayloadSchema.openapi('Payload'),
}).openapi('EmailLoginResponse');

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type EmailLogin = z.infer<typeof EmailLoginSchema>;
export type EmailLoginResponse = z.infer<typeof EmailLoginResponseSchema>;