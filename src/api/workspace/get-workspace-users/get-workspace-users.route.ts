import { createRoute, z } from "@hono/zod-openapi";
import { GetUserSchema } from "../../users/users.model.js";

export const GetWorkspaceUsersRoute = createRoute({
  path: ':id/users',
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
          schema: GetUserSchema.array(),
        },
      },
      description: 'Successfully retrieved workspace users',
    },
    500: {
      description: 'Internal server error',
    },
  },
});