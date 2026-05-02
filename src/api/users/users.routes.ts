
import { OpenAPIHono } from "@hono/zod-openapi";
import { authMiddleware } from "src/middleware/auth.middleware";
import { GetUsersRoute } from "./get-users/get-users.route";
import { getUsers } from "./get-users/get-users.controller";
import { GetUserRoute } from "./get-user/get-user.route";
import { getUser } from "./get-user/get-user.controller";
import { CreateUserRoute } from "./post-user/post-user.route";
import { deleteUser } from "./delete-user/delete-user.controller";
import { postUser } from "./post-user/post-user.controller";
import { PatchUserRoute } from "./patch-user/patch-user.route";
import { patchUser } from "./patch-user/patch-user.controller";
import { DeleteUserRoute } from "./delete-user/delete-user.route";
import { UsernameExistsRoute } from "./username-exists/username-exists.route";
import { usernameExist } from "./username-exists/username-exists.controller";
import { EmailExistsRoute } from "./email-exists/email-exists.route";
import { emailExists } from "./email-exists/email-exists.controller";

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