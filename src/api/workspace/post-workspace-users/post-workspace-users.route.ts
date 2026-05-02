import { createRoute, z } from "@hono/zod-openapi";
import { GetUserSchema } from "src/api/users/users.model";

export const PostWorkspaceUsersRoute = createRoute({
  path: ':id/users',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            users: GetUserSchema.array(),
          }),
        },
      },
      required: true,
    },
    params: z.object({
      id: z.string(),
    }),
    headers: z.object({
      'Content-Type': z.string().default('application/json'),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetUserSchema.array(),
        },
      },
      description: 'Successfully added workspace users',
    },
    500: {
      description: 'Internal server error',
    },
  },
});