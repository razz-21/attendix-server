import { getUsers, getUserById, createUser, updateUser, deleteUser, isUsernameExists, isEmailExists } from "../users.controller.js";
import { OpenAPIHono } from "@hono/zod-openapi";
import { GetPaginatedUsersRoute } from "./get-paginated-users.route.js";
import { GetUserByIdRoute } from "./get-user-by-id.route.js";
import { CreateUserRoute } from "./create-user.route.js";
import { UpdateUserRoute } from "./update-user.route.js";
import { DeleteUserRoute } from "./delete-user.route.js";
import { authMiddleware } from "@middleware/auth.middleware.js";
import { EmailExistsRoute } from "./email-exist.route.js";
import { UsernameExistsRoute } from "./username-exist.route.js";

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