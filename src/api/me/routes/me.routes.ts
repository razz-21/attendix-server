import { OpenAPIHono } from "@hono/zod-openapi";
import { GetMeRoute } from "./get-me.route";
import { getMe } from "../me.controller";
import { authMiddleware } from "@middleware/auth.middleware";

const meRoutes = new OpenAPIHono();

meRoutes.use("*", authMiddleware);

meRoutes.openapi(GetMeRoute, getMe);

export default meRoutes;