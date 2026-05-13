import { createRoute, z } from "@hono/zod-openapi";
import { ImportGroupBodySchema, ImportGroupResponseSchema } from "../attendees.model.js";

export const ImportGroupRoute = createRoute({
  method: 'post',
  path: '/import-group',
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
          schema: ImportGroupBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ImportGroupResponseSchema,
        },
      },
      description: 'Import successful',
    },
    400: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Bad request',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Not found',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: 'Server error',
    },
  },
  tags: ['Attendees'],
  description: 'Import attendees from an existing group',
});
