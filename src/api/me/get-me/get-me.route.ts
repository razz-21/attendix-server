import { GetUserSchema } from "../../users/users.model.js";
import { createRoute } from "@hono/zod-openapi";

export const GetMeRoute = createRoute({
  path: '/',
  method: 'get',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetUserSchema,
        },
      },
      description: 'Successfully retrieved current user',
    },
    500: {
      description: 'Internal server error',
    },
  },
});