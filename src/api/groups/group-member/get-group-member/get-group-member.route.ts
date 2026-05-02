import { createRoute } from "@hono/zod-openapi";
import { GetPaginatedGroupMemberParamsSchema, GetPaginatedGroupMembersSchema } from "../groups-member.model";
import { z } from "@hono/zod-openapi";

export const GetGroupMembersRoute = createRoute({
  path: '/:group_id/members',
  method: 'get',
  request: {
    params: z.object({ group_id: z.string() }),
    query: GetPaginatedGroupMemberParamsSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: GetPaginatedGroupMembersSchema } },
      description: 'Successfully retrieved group members',
    },
    500: { description: 'Internal server error' },
  },
});