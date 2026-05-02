import { createRoute, z } from "@hono/zod-openapi";
import { GetGroupMemberSchema, PostGroupMemberSchema } from "../groups-member.model";

export const PostGroupMemberRoute = createRoute({
  path: '/:group_id/members',
  method: 'post',
  request: {
    params: z.object({ group_id: z.string() }),
    body: {
      content: { 'application/json': { schema: PostGroupMemberSchema } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: GetGroupMemberSchema } },
      description: 'Successfully created group member',
    },
    400: { description: 'Validation failed' },
    500: { description: 'Internal server error' },
  },
});