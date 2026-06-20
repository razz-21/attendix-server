import { createRoute, z } from "@hono/zod-openapi";
import { GetPaginatedUserParamsSchema, GetPaginatedUsersSchema } from "../users.model.js";

export const GetUsersRoute = createRoute({
  path: '',
  method: 'get',
  request: {
    params: GetPaginatedUserParamsSchema,
    headers: z.object({
      'Content-Type': z.string().default('application/json'),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetPaginatedUsersSchema,
        },
      },
      description: 'Successfully retrieved paginated users',
    },
    500: {
      description: 'Internal server error',
    }
  },
});