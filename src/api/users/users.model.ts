import { z } from "@hono/zod-openapi";

export const UserStatusSchema = z.enum(['active', 'inactive', 'needs_verification']);
export const UserRoleSchema = z.enum(['admin', 'user']);

export const UserSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  rfid: z.string({ error: 'RFID is required' })
    .trim()
    .min(1, 'RFID is required')
    .openapi({
      description: 'The RFID of the user',
      example: '1234567890',
    }),
  firstname: z.string({ error: 'First name is required' })
    .trim()
    .min(1, 'First name is required')
    .openapi({
      description: 'The first name of the user',
      example: 'John',
    }),
  lastname: z.string({ error: 'Last name is required' })
    .min(1, 'Last name is required')
    .openapi({
      description: 'The last name of the user',
      example: 'Doe',
    }),
  department: z.string({ error: 'Department is required' })
    .trim()
    .min(1, 'Department is required')
    .openapi({
      description: 'The department of the user',
      example: 'College of Information Technology',
    }),
  role: z.string({ error: 'Role is required' })
    .trim()
    .min(1, 'Role is required')
    .pipe(UserRoleSchema)
    .openapi({
      description: 'The role of the user',
      example: 'admin',
    }),
  username: z.string({ error: 'Username is required' })
    .trim()
    .min(1, 'Username is required')
    .openapi({
      description: 'The username of the user',
      example: 'john.doe',
    }),
  password: z.string({ error: 'Password is required' })
    .trim()
    .min(1, 'Password is required')
    .openapi({
      description: 'The password of the user',
      example: 'password',
    }),
  status: z.string({ error: 'Status is required' })
    .trim()
    .min(1, 'Status is required')
    .pipe(UserStatusSchema)
    .openapi({
      description: 'The status of the user',
      example: 'active',
    }),
  created_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the user was created',
      example: '2021-01-01T00:00:00.000Z',
    }),
  updated_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the user was last updated',
      example: '2021-01-01T00:00:00.000Z',
    }),
}).openapi('User');

export const GetUserSchema = UserSchema.omit({ password: true }).openapi('GetUser');
export const GetPaginatedUserParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  q: z.string().optional(),
}).openapi('GetPaginatedUserParams');
export const GetPaginatedUsersSchema = z.object({
  data: z.array(GetUserSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
}).openapi('GetPaginatedUsers');
export const PostUserSchema = UserSchema.strict().openapi('PostUser');
export const PatchUserSchema = UserSchema
  .omit({ id: true, created_at: true, updated_at: true })
  .partial()
  .strict()
  .openapi('PatchUser');
export const DeleteUserSchema = z.object({
  id: z.string(),
}).openapi('DeleteUser');

export type User = z.infer<typeof UserSchema>;
export type GetUser = z.infer<typeof GetUserSchema>;
export type GetPaginatedUsers = z.infer<typeof GetPaginatedUsersSchema>;
export type GetPaginatedUserParams = z.infer<typeof GetPaginatedUserParamsSchema>;
export type PostUser = z.infer<typeof PostUserSchema>;
export type PatchUser = z.infer<typeof PatchUserSchema>;
export type DeleteUser = z.infer<typeof DeleteUserSchema>;