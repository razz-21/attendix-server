import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceSchema, PatchAttendanceSchema } from "../attendance.model.js";

export const PatchAttendanceRoute = createRoute({
  path: ':id',
  method: 'patch',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: PatchAttendanceSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetAttendanceSchema,
        },
      },
      description: 'Successfully updated attendance',
    },
    404: {
      description: 'Attendance not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
