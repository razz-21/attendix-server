import { createRoute, z } from "@hono/zod-openapi";
import { GetWorkspaceSchema } from "../workspace.model.js";

export const GetWorkspaceRoute = createRoute({
  path: ':id',
  method: 'get',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetWorkspaceSchema,
        },
      },
      description: 'Successfully retrieved workspace',
    },
    404: {
      description: 'Workspace not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});