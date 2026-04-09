import { OpenAPIHono } from "@hono/zod-openapi";
import { GetMeRoute } from "./get-me.route.js";
import { getMe } from "../me.controller.js";
import { authMiddleware } from "@middleware/auth.middleware.js";

const meRoutes = new OpenAPIHono();

meRoutes.use("*", authMiddleware);

meRoutes.openapi(GetMeRoute, getMe);

export default meRoutes;