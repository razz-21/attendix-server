import { createRoute, z } from "@hono/zod-openapi";

export const EmailLogoutRoute = createRoute({
  path: '/logout',
  method: 'delete',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The message of the response',
                example: 'Successfully logged out',
              },
            },
          }
        },
      },
      description: 'Successfully logged out',
    },
    500: {
      description: 'Internal server error',
    },
  },
});