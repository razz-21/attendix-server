import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceSchema } from "../attendance.model.js";

export const GetAttendanceRecordRoute = createRoute({
  path: '/:attendance_id/attendance/:id',
  method: 'get',
  request: {
    params: z.object({ attendance_id: z.string(), id: z.string() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetAttendanceSchema,
        },
      },
      description: 'Successfully retrieved attendance record',
    },
    404: { description: 'Attendance record not found' },
    500: { description: 'Internal server error' },
  },
});