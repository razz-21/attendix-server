import { OpenAPIHono } from "@hono/zod-openapi";
import { GetWorkspaceRoute } from "./get-workspace/get-workspace.route";
import { getWorkspace } from "./get-workspace/get-workspace.controller";
import { PostWorkspaceRoute } from "./post-workspace/post-workspace.route";
import { postWorkspace } from "./post-workspace/post-workspace.controller";
import { DeleteWorkspaceRoute } from "./delete-workspace/delete-workspace.route";
import { deleteWorkspace } from "./delete-workspace/delete-workspace.controller";
import { GetWorkspacesRoute } from "./get-workspaces/get-workspaces.route";
import { getWorkspaces } from "./get-workspaces/get-workspaces.controller";
import { PatchWorkspaceRoute } from "./patch-workspace/patch-workspace.route";
import { patchWorkspace } from "./patch-workspace/patch-workspace.controller";

const workspaceRoutes = new OpenAPIHono();

workspaceRoutes.openapi(GetWorkspacesRoute, getWorkspaces);
workspaceRoutes.openapi(GetWorkspaceRoute, getWorkspace);
workspaceRoutes.openapi(PostWorkspaceRoute, postWorkspace);
workspaceRoutes.openapi(DeleteWorkspaceRoute, deleteWorkspace);
workspaceRoutes.openapi(PatchWorkspaceRoute, patchWorkspace);

export default workspaceRoutes;