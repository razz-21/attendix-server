import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema, PatchAttendanceRecordSchema } from "../attendance-record.model.js";

export const PatchAttendanceRecordRoute = createRoute({
  path: '/:attendance_id/records/:id',
  method: 'patch',
  request: {
    params: z.object({ attendance_id: z.string(), id: z.string() }),
    body: {
      content: { 'application/json': { schema: PatchAttendanceRecordSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetAttendanceRecordSchema } },
      description: 'Successfully updated attendance record',
    },
    400: { description: 'Validation failed' },
    404: { description: 'Attendance record not found' },
    500: { description: 'Internal server error' },
  },
});