import { createRoute } from "@hono/zod-openapi";
import { GetUserSchema } from "../../users/users.model.js";
import { PostRequestAccountSchema } from "../auth.model.js";

export const RequestAccountRoute = createRoute({
  path: '/request-account',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostRequestAccountSchema,
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
      description: 'Successfully requested account',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});