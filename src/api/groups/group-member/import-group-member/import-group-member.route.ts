import { createRoute, z } from "@hono/zod-openapi";
import { ImportGroupMemberSchema } from "../groups-member.model.js";

export const ImportGroupMemberRoute = createRoute({
  path: '/:group_id/members/import',
  method: 'post',
  request: {
    params: z.object({ group_id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: ImportGroupMemberSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully imported group members',
    },
    400: {
      description: 'Bad request - invalid rows',
    },
    500: {
      description: 'Internal server error',
    },
  },
});