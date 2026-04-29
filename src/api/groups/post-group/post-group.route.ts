import { createRoute } from "@hono/zod-openapi";
import { GetGroupSchema, PostGroupSchema } from "../groups.model.js";

export const PostGroupRoute = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostGroupSchema,
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
      description: 'Successfully created group',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});