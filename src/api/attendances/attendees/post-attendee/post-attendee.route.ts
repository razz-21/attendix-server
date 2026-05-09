import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { PostAttendeeSchema, AttendeeSchema } from "../attendees.model.js";

export const PostAttendeeRoute = createRoute({
  path: '/:id/attendees',
  method: 'post',
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
    }),
    body: {
      content: {
        'application/json': {
          schema: PostAttendeeSchema,
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
      description: 'Successfully created attendee',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
  tags: ['Attendees'],
});
