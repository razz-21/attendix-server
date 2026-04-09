import { createRoute, z } from "@hono/zod-openapi";
import { GetUserSchema, PostUserSchema } from "../users.model.js";

export const CreateUserRoute = createRoute({
  path: '',
  method: 'post',
  request: {
    headers: z.object({
      'Content-Type': z.string().default('application/json'),
    }),
    body: {
      content: {
        'application/json': {
          schema: PostUserSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetUserSchema,
        },
      },
      description: 'Successfully created user',
    },
    500: {
      description: 'Internal server error',
    },
    400: {
      description: 'Bad request',
    }
  },
});