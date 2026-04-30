import { createRoute, z } from "@hono/zod-openapi";

export const DeleteUserRoute = createRoute({
  path: ':id',
  method: 'delete',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.boolean(),
        },
      },
      description: 'Successfully deleted user',
    },
    500: {
      description: 'Internal server error',
    },
  },
});