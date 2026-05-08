import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema, PostAttendanceRecordSchema } from "../attendance.model.js";

export const PostAttendanceRecordRoute = createRoute({
  path: '/:attendance_id/records',
  method: 'post',
  request: {
    params: z.object({ attendance_id: z.string() }),
    body: {
      content: { 'application/json': { schema: PostAttendanceRecordSchema } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: GetAttendanceRecordSchema } },
      description: 'Successfully created attendance record',
    },
    400: { description: 'Validation failed' },
    500: { description: 'Internal server error' },
  },
});