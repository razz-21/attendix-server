import { createRoute, z } from "@hono/zod-openapi";

export const DeleteWorkspaceRoute = createRoute({
  path: '/:id',
  method: 'delete',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.boolean(),
        },
      },
      description: 'Successfully deleted workspace',
    },
    404: {
      description: 'Workspace not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});