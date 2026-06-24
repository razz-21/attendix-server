import { createRoute, z } from "@hono/zod-openapi";
import { BulkDeleteAttendancesSchema } from "../attendance.model.js";

export const BulkDeleteAttendancesRoute = createRoute({
  path: '/bulk-delete',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BulkDeleteAttendancesSchema,
        },
      },
    },
  },
  responses: {
    200: { description: 'Successfully deleted attendances' },
    400: { description: 'Bad request' },
    404: { description: 'No attendances were deleted' },
    500: { description: 'Internal server error' },
  },
});
