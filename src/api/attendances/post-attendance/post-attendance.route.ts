import { createRoute } from "@hono/zod-openapi";
import { GetAttendanceSchema, PostAttendanceSchema } from "../attendance.model.js";

export const PostAttendanceRoute = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostAttendanceSchema,
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
      description: 'Successfully created attendance',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
