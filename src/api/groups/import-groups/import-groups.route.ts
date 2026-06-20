import { createRoute, z } from "@hono/zod-openapi";
import { PostGroupSchema } from "../groups.model.js";

export const ImportGroupsRoute = createRoute({
  path: '/import',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.array(PostGroupSchema),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully imported groups',
    },
    400: {
      description: 'Bad request - invalid rows',
    },
    500: {
      description: 'Internal server error',
    },
  },
});