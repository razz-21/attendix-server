import { createRoute } from "@hono/zod-openapi";
import { GetPaginatedGroupParamsSchema, GetPaginatedGroupsSchema } from "../groups.model.js";

export const GetGroupsRoute = createRoute({
  path: '/',
  method: 'get',
  request: {
    query: GetPaginatedGroupParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetPaginatedGroupsSchema,
        },
      },
      description: 'Successfully retrieved paginated groups',
    },
    500: {
      description: 'Internal server error',
    },
  },
});