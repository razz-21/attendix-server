import { createRoute, z } from "@hono/zod-openapi";
import { GetGroupSchema } from "../groups.model.js";

export const GetGroupRoute = createRoute({
  path: '/:id',
  method: 'get',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetGroupSchema,
        },
      },
      description: 'Successfully retrieved group',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});