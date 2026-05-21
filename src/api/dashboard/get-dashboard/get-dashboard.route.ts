import { createRoute } from "@hono/zod-openapi";
import { DashboardResponseSchema } from "../dashboard.model.js";

export const GetDashboardRoute = createRoute({
  path: '/home',
  method: 'get',
  responses: {
    200: {
      content: { 'application/json': { schema: DashboardResponseSchema } },
      description: 'Successfully retrieved dashboard data',
    },
    500: { description: 'Internal server error' },
  },
});