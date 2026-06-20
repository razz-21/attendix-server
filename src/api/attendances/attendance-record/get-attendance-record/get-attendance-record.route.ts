import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema } from "../attendance-record.model.js";

export const GetAttendanceRecordRoute = createRoute({
  path: '/',
  method: 'get',
  request: {
    params: z.object({ attendances_id: z.string() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(GetAttendanceRecordSchema),
        },
      },
      description: 'Successfully retrieved attendance record',
    },
    400: {
      description: 'Validation failed',
    },
    500: {
      description: 'Internal server error',
    },
  },
});