import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema } from "../attendance-record.model.js";

export const publicPostAttendanceRecordRoute = createRoute({
  path: '/:attendances_id/public-attendance-record',
  method: 'post',
  request: {
    params: z.object({ attendances_id: z.string(), }),
    query: z.object({
      attendance_id: z.string(),
      rfid: z.string(),
      otc: z.string(),
    }),
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