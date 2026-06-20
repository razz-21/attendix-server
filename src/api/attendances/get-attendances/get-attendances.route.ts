import { createRoute } from "@hono/zod-openapi";
import { GetAttendanceSchema, GetAttendancesQuerySchema } from "../attendance.model.js";
import { z } from "@hono/zod-openapi";

export const GetAttendancesRoute = createRoute({
  path: '/',
  method: 'get',
  request: {
    query: GetAttendancesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(GetAttendanceSchema),
        },
      },
      description: 'Successfully retrieved attendances',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
