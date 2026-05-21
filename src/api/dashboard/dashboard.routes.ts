import { OpenAPIHono } from "@hono/zod-openapi";
import { GetDashboardRoute } from "./get-dashboard/get-dashboard.route.js";
import { getDashboardController } from "./get-dashboard/get-dashboard.controller.js";
import { SearchAttendancesRoute } from "./search-attendances/search-attendances.route.js";
import { searchAttendancesController } from "./search-attendances/search-attendances.controller.js";

const dashboardRoutes = new OpenAPIHono();

dashboardRoutes.openapi(GetDashboardRoute, getDashboardController);
dashboardRoutes.openapi(SearchAttendancesRoute, searchAttendancesController);

export default dashboardRoutes;