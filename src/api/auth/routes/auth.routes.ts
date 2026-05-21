import { OpenAPIHono } from "@hono/zod-openapi";
import { emailLogin, emailLogout } from "../auth.controller.js";
import { requestPasswordReset, verifyToken, resetPassword } from "../forgot-password/forgot-password.controller.js";
import { EmailLoginRoute } from "./email-login.route.js";
import { EmailLogoutRoute } from "./logout.route.js";
import { ForgotPasswordRoute, VerifyTokenRoute, ResetPasswordRoute } from "./forgot-password.route.js";
import { RequestAccountRoute } from "../request-account/request-accout.route.js";
import { postRequestAccountController } from "../request-account/request-account.controller.js";

const authRoutes = new OpenAPIHono();

authRoutes.openapi(EmailLoginRoute, emailLogin);
authRoutes.openapi(EmailLogoutRoute, emailLogout);
authRoutes.openapi(ForgotPasswordRoute, requestPasswordReset);
authRoutes.openapi(VerifyTokenRoute, verifyToken);
authRoutes.openapi(ResetPasswordRoute, resetPassword);
authRoutes.openapi(RequestAccountRoute, postRequestAccountController);

export default authRoutes;