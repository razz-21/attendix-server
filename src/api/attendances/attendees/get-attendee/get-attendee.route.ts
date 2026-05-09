import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { AttendeeSchema } from "../attendees.model.js";

export const GetAttendeeRoute = createRoute({
  path: '/:id/attendees/{attendees_record_id}',
  method: 'get',
  request: {
    params: z.object({
      id: z.string().uuid('Invalid attendance ID').openapi({
        param: {
          name: 'id',
          in: 'path',
        },
        description: 'Attendance ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      attendees_record_id: z.string().uuid('Invalid attendee ID').openapi({
        param: {
          name: 'attendees_record_id',
          in: 'path',
        },
        description: 'Attendee record ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AttendeeSchema,
        },
      },
      description: 'Successfully retrieved attendee',
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
