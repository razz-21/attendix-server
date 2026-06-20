import { createRoute, z } from "@hono/zod-openapi";

export const DeleteGroupRoute = createRoute({
  path: '/:id',
  method: 'delete',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Successfully deleted group',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});