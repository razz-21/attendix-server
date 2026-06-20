import { createRoute, z } from "@hono/zod-openapi";
import { GetGroupSchema, PatchGroupSchema } from "../groups.model.js";

export const PatchGroupRoute = createRoute({
  path: '/:id',
  method: 'patch',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: PatchGroupSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetGroupSchema,
        },
      },
      description: 'Successfully updated group',
    },
    400: {
      description: 'Bad request',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});