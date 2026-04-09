import { createRoute, z } from "@hono/zod-openapi";
import { GetUserSchema } from "../users.model";

export const GetUserByIdRoute = createRoute({
  path: ':id',
  method: 'get',
  request: {
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
          schema: GetUserSchema,
        },
      },
      description: 'Successfully retrieved user by id',
    },
    500: {
      description: 'Internal server error',
    },
  },
});