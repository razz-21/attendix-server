import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceSchema, PostAttendanceSchema } from "../attendance.model.js";

export const PostAttendanceRoute = createRoute({
  path: '/:attendance_id/records',
  method: 'post',
  request: {
    params: z.object({ attendance_id: z.string() }),
    body: {
      content: { 'application/json': { schema: PostAttendanceSchema } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: GetAttendanceSchema } },
      description: 'Successfully created attendance record',
    },
    400: { description: 'Validation failed' },
    500: { description: 'Internal server error' },
  },
});