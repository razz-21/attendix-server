import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceSchema } from "../attendance.model.js";

export const GetAttendanceRoute = createRoute({
  path: ':id',
  method: 'get',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetAttendanceSchema,
        },
      },
      description: 'Successfully retrieved attendance',
    },
    404: {
      description: 'Attendance not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
