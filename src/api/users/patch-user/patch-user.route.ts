import { createRoute, z } from "@hono/zod-openapi";
import { GetUserSchema, PatchUserSchema } from "../users.model.js";

export const PatchUserRoute = createRoute({
  path: ':id',
  method: 'patch',
  request: {
    params: z.object({
      id: z.string(),
    }),
    headers: z.object({
      'Content-Type': z.string().default('application/json'),
    }),
    body: {
      content: {
        'application/json': {
          schema: PatchUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetUserSchema,
        },
      },
      description: 'Successfully updated user',
    },
    500: {
      description: 'Internal server error',
    },
    400: {
      description: 'Bad request',
    },
  },
});