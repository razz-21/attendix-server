import { OpenAPIHono } from "@hono/zod-openapi";
import { GetMeRoute } from "./get-me/get-me.route.js";
import { getMe } from "./get-me/get-me.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { PatchMePasswordRoute } from "./patch-me-password/patch-me-password.route.js";
import { patchMePassword } from "./patch-me-password/patch-me-password.controller.js";

const meRoutes = new OpenAPIHono();

meRoutes.use("*", authMiddleware);

meRoutes.openapi(GetMeRoute, getMe);
meRoutes.openapi(PatchMePasswordRoute, patchMePassword);

export default meRoutes;