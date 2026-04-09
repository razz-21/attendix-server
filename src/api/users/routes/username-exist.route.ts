import { createRoute, z } from "@hono/zod-openapi";
import { UsernameExistsSchema } from "../users.model";

export const UsernameExistsRoute = createRoute({
  path: '/username-exists',
  method: 'get',
  request: {
    params: z.object({
      username: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UsernameExistsSchema,
        },
      },
      description: 'Successfully checked if username exists',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});