import { createRoute, z } from "@hono/zod-openapi";
import { PatchMePasswordSchema } from "../me.model";


export const PatchMePasswordRoute = createRoute({
  path: '/password',
  method: 'patch',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PatchMePasswordSchema
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: 'Successfully updated password',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});