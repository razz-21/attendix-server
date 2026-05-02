import { createRoute, z } from "@hono/zod-openapi";

export const DeleteAttendanceRoute = createRoute({
  path: '/:id',
  method: 'delete',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.boolean(),
        },
      },
      description: 'Successfully deleted attendance',
    },
    404: {
      description: 'Attendance not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
