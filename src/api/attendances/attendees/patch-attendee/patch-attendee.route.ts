import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { PatchAttendeeSchema, AttendeeSchema } from "../attendees.model.js";

export const PatchAttendeeRoute = createRoute({
  path: '/:attendee_id',
  method: 'patch',
  request: {
    params: z.object({
      attendances_id: z.string().uuid('Invalid attendances ID').openapi({
        param: {
          name: 'attendances_id',
          in: 'path',
        },
        description: 'Attendance ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: PatchAttendeeSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AttendeeSchema,
        },
      },
      description: 'Successfully updated attendee',
    },
    400: {
      description: 'Bad request',
    },
    404: {
      description: 'Attendee not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
  tags: ['Attendees'],
});
