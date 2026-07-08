import { createRoute, z } from "@hono/zod-openapi";

export const GetOtcRoute = createRoute({
  path: '/:attendance_id/otc',
  method: 'get',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            otc: z.string(),
            expires_in: z.number(),
          }),
        },
      },
      description: 'OTC generated successfully',
    },
    500: {
      description: 'Internal server error',
    },
  },
});