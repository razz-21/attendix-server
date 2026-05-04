
import { OpenAPIHono } from "@hono/zod-openapi";
import { authMiddleware } from "src/middleware/auth.middleware.js";
import { GetUsersRoute } from "./get-users/get-users.route.js";
import { getUsers } from "./get-users/get-users.controller.js";
import { GetUserRoute } from "./get-user/get-user.route.js";
import { getUser } from "./get-user/get-user.controller.js";
import { CreateUserRoute } from "./post-user/post-user.route.js";
import { deleteUser } from "./delete-user/delete-user.controller.js";
import { postUser } from "./post-user/post-user.controller.js";
import { PatchUserRoute } from "./patch-user/patch-user.route.js";
import { patchUser } from "./patch-user/patch-user.controller.js";
import { DeleteUserRoute } from "./delete-user/delete-user.route.js";
import { UsernameExistsRoute } from "./username-exists/username-exists.route.js";
import { usernameExist } from "./username-exists/username-exists.controller.js";
import { EmailExistsRoute } from "./email-exists/email-exists.route.js";
import { emailExists } from "./email-exists/email-exists.controller.js";

const usersRoutes = new OpenAPIHono();

usersRoutes.use("*", authMiddleware);

usersRoutes.openapi(GetUsersRoute, getUsers);
usersRoutes.openapi(GetUserRoute, getUser);
usersRoutes.openapi(CreateUserRoute, postUser);
usersRoutes.openapi(PatchUserRoute, patchUser);
usersRoutes.openapi(DeleteUserRoute, deleteUser);
usersRoutes.openapi(UsernameExistsRoute, usernameExist);
usersRoutes.openapi(EmailExistsRoute, emailExists);

export default usersRoutes;