import { createRoute, z } from "@hono/zod-openapi";

export const SelectWorkspaceRoute = createRoute({
  path: '/select',
  method: 'patch',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ workspace_id: z.string() }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ message: z.string() }) } },
      description: 'Workspace selected successfully',
    },
    400: { description: 'Bad request' },
    500: { description: 'Internal server error' },
  },
});