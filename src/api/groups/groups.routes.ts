import { OpenAPIHono } from "@hono/zod-openapi";
import { GetGroupsRoute } from "./get-groups/get-groups.route.js";
import { getGroups } from "./get-groups/get-groups.controller.js";
import { GetGroupRoute } from "./get-group/get-group.route.js";
import { getGroup } from "./get-group/get-group.controller.js";
import { PostGroupRoute } from "./post-group/post-group.route.js";
import { postGroup } from "./post-group/post-group.controller.js";
import { PatchGroupRoute } from "./patch-group/patch-group.route.js";
import { patchGroup } from "./patch-group/patch-group.controller.js";
import { DeleteGroupRoute } from "./delete-group/delete-group.route.js";
import { deleteGroup } from "./delete-group/delete-group.controller.js";
import { ImportGroupsRoute } from "./import-groups/import-groups.route.js";
import { importGroupsController } from "./import-groups/import-groups.controller.js";

import { GetGroupMembersRoute } from "./group-member/get-group-member/get-group-member.route.js";
import { getGroupMembersController } from "./group-member/get-group-member/get-group-member.controller.js";
import { PostGroupMemberRoute } from "./group-member/post-group-member/post-group-member.route.js";
import { postGroupMemberController } from "./group-member/post-group-member/post-group-member.controller.js";
import { DeleteGroupMemberRoute } from "./group-member/delete-group-member/delete-group-member.route.js";
import { deleteGroupMemberController } from "./group-member/delete-group-member/delete-group-member.controller.js";
import { PatchGroupMemberRoute } from "./group-member/patch-group-member/patch-group-member.route.js";
import { patchGroupMemberController } from "./group-member/patch-group-member/patch-group-member.controller.js";

const groupRoutes = new OpenAPIHono();

groupRoutes.openapi(GetGroupsRoute, getGroups);
groupRoutes.openapi(GetGroupRoute, getGroup);
groupRoutes.openapi(PostGroupRoute, postGroup);
groupRoutes.openapi(PatchGroupRoute, patchGroup);
groupRoutes.openapi(DeleteGroupRoute, deleteGroup);
groupRoutes.openapi(ImportGroupsRoute, importGroupsController);

groupRoutes.openapi(GetGroupMembersRoute, getGroupMembersController);
groupRoutes.openapi(PostGroupMemberRoute, postGroupMemberController);
groupRoutes.openapi(DeleteGroupMemberRoute, deleteGroupMemberController);
groupRoutes.openapi(PatchGroupMemberRoute, patchGroupMemberController);

export default groupRoutes;