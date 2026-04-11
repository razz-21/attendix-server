import { OpenAPIHono } from "@hono/zod-openapi";
import { GetMeRoute } from "./get-me.route.js";
import { getMe, patchMePassword } from "../me.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { PatchMePasswordRoute } from "./patch-me-password.route.js";

const meRoutes = new OpenAPIHono();

meRoutes.use("*", authMiddleware);

meRoutes.openapi(GetMeRoute, getMe);
meRoutes.openapi(PatchMePasswordRoute, patchMePassword);

export default meRoutes;