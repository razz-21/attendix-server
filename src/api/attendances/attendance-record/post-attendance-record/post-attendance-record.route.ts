import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema, PostAttendanceRecordSchema } from "../attendance-record.model.js";

export const PostAttendanceRecordRoute = createRoute({
  path: '/',
  method: 'post',
  request: {
    params: z.object({ attendances_id: z.string() }),
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