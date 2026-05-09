import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceSchema, GetAttendancesQuerySchema } from "../attendance.model.js";

export const GetAttendancesRoute = createRoute({
  path: '/:attendance_id/records',
  method: 'get',
  request: {
    params: z.object({ attendance_id: z.string() }),
    query: GetAttendancesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(GetAttendanceSchema),
        },
      },
      description: 'Successfully retrieved attendance records',
    },
    500: { description: 'Internal server error' },
  },
});