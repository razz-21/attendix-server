import { getUsers, getUserById, createUser, updateUser, deleteUser, isUsernameExists, isEmailExists } from "../users.controller.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { GetPaginatedUsersRoute } from "./get-paginated-users.route";
import { GetUserByIdRoute } from "./get-user-by-id.route";
import { CreateUserRoute } from "./create-user.route";
import { UpdateUserRoute } from "./update-user.route";
import { DeleteUserRoute } from "./delete-user.route";
import { EmailExistsRoute } from "./email-exist.route";
import { UsernameExistsRoute } from "./username-exist.route";
import { authMiddleware } from "../../../middleware/auth.middleware";

const usersRoutes = new OpenAPIHono();

usersRoutes.use("*", authMiddleware);

usersRoutes.openapi(GetPaginatedUsersRoute, getUsers);
usersRoutes.openapi(GetUserByIdRoute, getUserById);
usersRoutes.openapi(CreateUserRoute, createUser);
usersRoutes.openapi(UpdateUserRoute, updateUser);
usersRoutes.openapi(DeleteUserRoute, deleteUser);
usersRoutes.openapi(UsernameExistsRoute, isUsernameExists);
usersRoutes.openapi(EmailExistsRoute, isEmailExists);

export default usersRoutes;