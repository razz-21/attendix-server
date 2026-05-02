import { createRoute, z } from "@hono/zod-openapi";

export const DeleteGroupMemberRoute = createRoute({
  path: '/:group_id/members/:id',
  method: 'delete',
  request: {
    params: z.object({ group_id: z.string(), id: z.string() }),
  },
  responses: {
    200: { description: 'Successfully deleted group member' },
    404: { description: 'Group member not found' },
    500: { description: 'Internal server error' },
  },
});