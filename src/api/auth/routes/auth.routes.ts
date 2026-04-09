import { OpenAPIHono } from "@hono/zod-openapi";
import { emailLogin, emailLogout } from "../auth.controller.js";
import { EmailLoginRoute } from "./email-login.route.js";
import { EmailLogoutRoute } from "./logout.route.js";

const authRoutes = new OpenAPIHono();

authRoutes.openapi(EmailLoginRoute, emailLogin);
authRoutes.openapi(EmailLogoutRoute, emailLogout);

export default authRoutes;