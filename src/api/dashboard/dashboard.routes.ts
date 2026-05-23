import { OpenAPIHono } from "@hono/zod-openapi";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { GetDashboardRoute } from "./get-dashboard/get-dashboard.route.js";
import { getDashboardController } from "./get-dashboard/get-dashboard.controller.js";
import { SearchAttendancesRoute } from "./search-attendances/search-attendances.route.js";
import { searchAttendancesController } from "./search-attendances/search-attendances.controller.js";

const dashboardRoutes = new OpenAPIHono();

dashboardRoutes.use("*", authMiddleware);

dashboardRoutes.openapi(GetDashboardRoute, getDashboardController);
dashboardRoutes.openapi(SearchAttendancesRoute, searchAttendancesController);

export default dashboardRoutes;