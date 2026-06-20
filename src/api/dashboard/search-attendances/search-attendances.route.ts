import { createRoute, z } from "@hono/zod-openapi";

export const SearchAttendancesRoute = createRoute({
  path: '/attendances/search',
  method: 'get',
  request: {
    query: z.object({ q: z.string().optional() }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.array(z.any()) } },
      description: 'Successfully searched attendances',
    },
    500: { description: 'Internal server error' },
  },
});