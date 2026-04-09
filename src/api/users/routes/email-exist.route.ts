import { createRoute, z } from "@hono/zod-openapi";
import { EmailExistsSchema } from "../users.model";


export const EmailExistsRoute = createRoute({
  path: '/email-exists',
  method: 'get',
  request: {
    params: z.object({
      email: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: EmailExistsSchema,
        },
      },
      description: 'Successfully checked if email exists',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});