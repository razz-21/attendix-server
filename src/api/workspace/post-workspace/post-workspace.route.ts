import { createRoute } from "@hono/zod-openapi";
import { GetWorkspaceSchema, PostWorkspaceSchema } from "../workspace.model";

export const PostWorkspaceRoute = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostWorkspaceSchema,
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
      description: 'Successfully created workspace',
    },
    400: {
      description: 'Bad request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});