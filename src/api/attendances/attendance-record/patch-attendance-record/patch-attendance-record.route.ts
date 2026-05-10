import { createRoute, z } from "@hono/zod-openapi";
import { GetAttendanceRecordSchema, PatchAttendanceRecordSchema } from "../attendance-record.model.js";

export const PatchAttendanceRecordRoute = createRoute({
  path: '/:id',
  method: 'patch',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: { 'application/json': { schema: PatchAttendanceRecordSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetAttendanceRecordSchema } },
      description: 'Successfully updated attendance record',
    },
    400: { description: 'Validation failed' },
    500: { description: 'Internal server error' },
  },
});