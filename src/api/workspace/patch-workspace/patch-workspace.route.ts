import { createRoute, z } from "@hono/zod-openapi";
import { GetWorkspaceSchema, PatchWorkspaceSchema } from "../workspace.model";

export const PatchWorkspaceRoute = createRoute({
  path: ':id',
  method: 'patch',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: PatchWorkspaceSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetWorkspaceSchema,
        },
      },
      description: 'Successfully updated workspace',
    },
    404: {
      description: 'Workspace not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});