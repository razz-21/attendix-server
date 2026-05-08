import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { AttendeeSchema, GetAttendeesQuerySchema } from "../attendees.model.js";

export const GetAttendeesRoute = createRoute({
  path: '/:id/attendees',
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
    }),
    query: GetAttendeesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(AttendeeSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
          }),
        },
      },
      description: 'Successfully retrieved attendees with pagination',
    },
    500: {
      description: 'Internal server error',
    },
  },
  tags: ['Attendees'],
});
