import { OpenAPIHono } from "@hono/zod-openapi";
import { emailLogin, emailLogout } from "../auth.controller";
import { EmailLoginRoute } from "./email-login.route";
import { EmailLogoutRoute } from "./logout.route";

const authRoutes = new OpenAPIHono();

authRoutes.openapi(EmailLoginRoute, emailLogin);
authRoutes.openapi(EmailLogoutRoute, emailLogout);

export default authRoutes;