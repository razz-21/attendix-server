import { OpenAPIHono } from "@hono/zod-openapi";
import { GetWorkspaceRoute } from "./get-workspace/get-workspace.route.js";
import { getWorkspace } from "./get-workspace/get-workspace.controller.js";
import { PostWorkspaceRoute } from "./post-workspace/post-workspace.route.js";
import { postWorkspace } from "./post-workspace/post-workspace.controller.js";
import { DeleteWorkspaceRoute } from "./delete-workspace/delete-workspace.route.js";
import { deleteWorkspace } from "./delete-workspace/delete-workspace.controller.js";
import { GetWorkspacesRoute } from "./get-workspaces/get-workspaces.route.js";
import { getWorkspaces } from "./get-workspaces/get-workspaces.controller.js";
import { PatchWorkspaceRoute } from "./patch-workspace/patch-workspace.route.js";
import { patchWorkspace } from "./patch-workspace/patch-workspace.controller.js";
import { authMiddleware } from "src/middleware/auth.middleware";
import { GetWorkspaceUsersRoute } from "./get-workspace-users/get-workspace-users.route.js";
import { getWorkspaceUsersController } from "./get-workspace-users/get-workspace-users.controller.js";

const workspaceRoutes = new OpenAPIHono();

workspaceRoutes.use("*", authMiddleware);

workspaceRoutes.openapi(GetWorkspacesRoute, getWorkspaces);
workspaceRoutes.openapi(GetWorkspaceRoute, getWorkspace);
workspaceRoutes.openapi(PostWorkspaceRoute, postWorkspace);
workspaceRoutes.openapi(DeleteWorkspaceRoute, deleteWorkspace);
workspaceRoutes.openapi(PatchWorkspaceRoute, patchWorkspace);
workspaceRoutes.openapi(GetWorkspaceUsersRoute, getWorkspaceUsersController);

export default workspaceRoutes;