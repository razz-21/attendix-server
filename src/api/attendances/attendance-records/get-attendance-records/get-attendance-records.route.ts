import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema, GetAttendanceRecordsQuerySchema } from "../attendance-record.model.js";

export const GetAttendanceRecordsRoute = createRoute({
  path: '/:attendance_id/records',
  method: 'get',
  request: {
    params: z.object({ attendance_id: z.string() }),
    query: GetAttendanceRecordsQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(GetAttendanceRecordSchema),
        },
      },
      description: 'Successfully retrieved attendance records',
    },
    500: { description: 'Internal server error' },
  },
});