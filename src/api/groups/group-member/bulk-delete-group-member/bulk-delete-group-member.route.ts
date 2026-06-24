import { createRoute, z } from "@hono/zod-openapi";
import { BulkDeleteGroupMembersSchema } from "../groups-member.model.js";

export const BulkDeleteGroupMembersRoute = createRoute({
  path: '/:group_id/members/bulk-delete',
  method: 'post',
  request: {
    params: z.object({ group_id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: BulkDeleteGroupMembersSchema,
        },
      },
    },
  },
  responses: {
    200: { description: 'Successfully deleted group members' },
    400: { description: 'Bad request' },
    500: { description: 'Internal server error' },
  },
});
