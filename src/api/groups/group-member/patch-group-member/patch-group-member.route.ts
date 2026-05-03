import { createRoute, z } from "@hono/zod-openapi";
import { GetGroupMemberSchema, PatchGroupMemberSchema } from "../groups-member.model";

export const PatchGroupMemberRoute = createRoute({
  path: '/:group_id/members/:id',
  method: 'put',
  request: {
    params: z.object({ group_id: z.string(), id: z.string() }),
    body: {
      content: { 'application/json': { schema: PatchGroupMemberSchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetGroupMemberSchema } },
      description: 'Successfully updated group member',
    },
    404: { description: 'Group member not found' },
    500: { description: 'Internal server error' },
  },
});