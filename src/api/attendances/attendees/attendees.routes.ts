import { OpenAPIHono } from "@hono/zod-openapi";
import { GetAttendeesRoute } from "./get-attendees/get-attendees.route.js";
import { getAttendeesController } from "./get-attendees/get-attendees.controller.js";
import { GetAttendeeRoute } from "./get-attendee/get-attendee.route.js";
import { getAttendeeController } from "./get-attendee/get-attendee.controller.js";
import { PostAttendeeRoute } from "./post-attendee/post-attendee.route.js";
import { postAttendeeController } from "./post-attendee/post-attendee.controller.js";
import { PatchAttendeeRoute } from "./patch-attendee/patch-attendee.route.js";
import { patchAttendeeController } from "./patch-attendee/patch-attendee.controller.js";
import { DeleteAttendeeRoute } from "./delete-attendee/delete-attendee.route.js";
import { deleteAttendeeController } from "./delete-attendee/delete-attendee.controller.js";
import { ImportGroupRoute } from "./import-group/import-group.route.js";
import { importGroupController } from "./import-group/import-group.controller.js";
import { BulkDeleteAttendeesRoute } from "./bulk-delete-attendees/bulk-delete-attendees.route.js";
import { bulkDeleteAttendeesController } from "./bulk-delete-attendees/bulk-delete-attendees.controller.js";

const attendeesRoutes = new OpenAPIHono();

attendeesRoutes.openapi(GetAttendeesRoute, getAttendeesController);
attendeesRoutes.openapi(ImportGroupRoute, importGroupController);
attendeesRoutes.openapi(BulkDeleteAttendeesRoute, bulkDeleteAttendeesController);
attendeesRoutes.openapi(GetAttendeeRoute, getAttendeeController);
attendeesRoutes.openapi(PostAttendeeRoute, postAttendeeController);
attendeesRoutes.openapi(PatchAttendeeRoute, patchAttendeeController);
attendeesRoutes.openapi(DeleteAttendeeRoute, deleteAttendeeController);

export default attendeesRoutes;
