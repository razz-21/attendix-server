import { createRoute, z } from "@hono/zod-openapi";
import { BulkDeleteAttendeesSchema } from "../attendees.model.js";

export const BulkDeleteAttendeesRoute = createRoute({
  path: '/bulk-delete',
  method: 'post',
  request: {
    params: z.object({
      attendances_id: z.string().uuid().openapi({
        param: {
          name: 'attendances_id',
          in: 'path',
        },
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: BulkDeleteAttendeesSchema,
        },
      },
    },
  },
  responses: {
    200: { description: 'Successfully deleted attendees' },
    400: { description: 'Bad request' },
    404: { description: 'No attendees were deleted' },
    500: { description: 'Internal server error' },
  },
  tags: ['Attendees'],
});
