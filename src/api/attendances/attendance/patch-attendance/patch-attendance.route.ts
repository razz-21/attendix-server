import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceSchema, PatchAttendanceSchema } from "../attendance.model.js";

export const PatchAttendanceRecordRoute = createRoute({
  path: '/:id',
  method: 'patch',
  request: {
    params: z.object({ attendances_id: z.string(), id: z.string() }),
    body: {
      content: { 'application/json': { schema: PatchAttendanceSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetAttendanceSchema } },
      description: 'Successfully updated attendance record',
    },
    400: { description: 'Validation failed' },
    404: { description: 'Attendance record not found' },
    500: { description: 'Internal server error' },
  },
});