import { createRoute, z } from "@hono/zod-openapi";

export const DeleteAttendanceRecordRoute = createRoute({
  path: '/:id',
  method: 'delete',
  request: {
    params: z.object({ attendances_id: z.string(), id: z.string() }),
  },
  responses: {
    200: { description: 'Successfully deleted attendance record' },
    404: { description: 'Attendance record not found' },
    500: { description: 'Internal server error' },
  },
});