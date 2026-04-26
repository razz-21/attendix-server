import { createRoute } from "@hono/zod-openapi";
import { GetPaginatedWorkspaceParamsSchema, GetPaginatedWorkspaceSchema } from "../workspace.model";

export const GetWorkspacesRoute = createRoute({
  path: '/',
  method: 'get',
  request: {
    query: GetPaginatedWorkspaceParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetPaginatedWorkspaceSchema,
        },
      },
      description: 'Successfully retrieved paginated workspaces',
    },
    500: {
      description: 'Internal server error',
    },
  },
});