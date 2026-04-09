import { createRoute } from "node_modules/@hono/zod-openapi/dist/index.cjs";
import { EmailLoginResponseSchema, EmailLoginSchema } from "../auth.model.js";

export const EmailLoginRoute = createRoute({
  path: '/email-login',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: EmailLoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EmailLoginResponseSchema,
        },
      },
      description: 'Successfully logged in',
    },
    400: {
      description: 'Bad request',
    },
    401: {
      description: 'Unauthorized: Invalid credentials',
    },
    500: {
      description: 'Internal server error',
    },
  },
});