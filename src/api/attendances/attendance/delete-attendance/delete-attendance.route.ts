import { createRoute, z } from "@hono/zod-openapi";

export const DeleteAttendanceRoute = createRoute({
  path: '/:id',
  method: 'delete',
  request: {
    params: z.object({ attendances_id: z.string(), id: z.string() }),
  },
  responses: {
    200: { description: 'Successfully deleted attendance' },
    404: { description: 'Attendance not found' },
    500: { description: 'Internal server error' },
  },
});