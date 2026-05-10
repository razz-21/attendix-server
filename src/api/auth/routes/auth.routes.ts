import { OpenAPIHono } from "@hono/zod-openapi";
import { emailLogin, emailLogout } from "../auth.controller.js";
import { requestPasswordReset, verifyToken, resetPassword } from "../forgot-password/forgot-password.controller.js";
import { EmailLoginRoute } from "./email-login.route.js";
import { EmailLogoutRoute } from "./logout.route.js";
import { ForgotPasswordRoute, VerifyTokenRoute, ResetPasswordRoute } from "./forgot-password.route.js";

const authRoutes = new OpenAPIHono();

authRoutes.openapi(EmailLoginRoute, emailLogin);
authRoutes.openapi(EmailLogoutRoute, emailLogout);
authRoutes.openapi(ForgotPasswordRoute, requestPasswordReset);
authRoutes.openapi(VerifyTokenRoute, verifyToken);
authRoutes.openapi(ResetPasswordRoute, resetPassword);

export default authRoutes;