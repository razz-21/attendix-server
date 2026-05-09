import { OpenAPIHono } from "@hono/zod-openapi";
import { GetAttendancesRoute } from "./get-attendances/get-attendances.route.js";
import { getAttendances } from "./get-attendances/get-attendances.controller.js";
import { GetAttendanceRoute } from "./get-attendance/get-attendance.route.js";
import { getAttendance } from "./get-attendance/get-attendance.controller.js";
import { PostAttendanceRoute } from "./post-attendance/post-attendance.route.js";
import { postAttendance } from "./post-attendance/post-attendance.controller.js";
import { PatchAttendanceRoute } from "./patch-attendance/patch-attendance.route.js";
import { patchAttendance } from "./patch-attendance/patch-attendance.controller.js";
import { DeleteAttendanceRoute } from "./delete-attendance/delete-attendance.route.js";
import { deleteAttendance } from "./delete-attendance/delete-attendance.controller.js";
import attendanceRecordRoutes from "./attendance/attendance.routes.js";

// Attendees routes and controllers
import { GetAttendeesRoute } from "./attendees/get-attendees/get-attendees.route.js";
import { getAttendeesController } from "./attendees/get-attendees/get-attendees.controller.js";
import { GetAttendeeRoute } from "./attendees/get-attendee/get-attendee.route.js";
import { getAttendeeController } from "./attendees/get-attendee/get-attendee.controller.js";
import { PostAttendeeRoute } from "./attendees/post-attendee/post-attendee.route.js";
import { postAttendeeController } from "./attendees/post-attendee/post-attendee.controller.js";
import { PatchAttendeeRoute } from "./attendees/patch-attendee/patch-attendee.route.js";
import { patchAttendeeController } from "./attendees/patch-attendee/patch-attendee.controller.js";
import { DeleteAttendeeRoute } from "./attendees/delete-attendee/delete-attendee.route.js";
import { deleteAttendeeController } from "./attendees/delete-attendee/delete-attendee.controller.js";

const attendanceRoutes = new OpenAPIHono();

attendanceRoutes.openapi(GetAttendancesRoute, getAttendances);
attendanceRoutes.openapi(GetAttendanceRoute, getAttendance);
attendanceRoutes.openapi(PostAttendanceRoute, postAttendance);
attendanceRoutes.openapi(PatchAttendanceRoute, patchAttendance);
attendanceRoutes.openapi(DeleteAttendanceRoute, deleteAttendance);

// Attendees routes - mount at root level (routes now include full path)
attendanceRoutes.openapi(GetAttendeesRoute, getAttendeesController);
attendanceRoutes.openapi(GetAttendeeRoute, getAttendeeController);
attendanceRoutes.openapi(PostAttendeeRoute, postAttendeeController);
attendanceRoutes.openapi(PatchAttendeeRoute, patchAttendeeController);
attendanceRoutes.openapi(DeleteAttendeeRoute, deleteAttendeeController);

attendanceRoutes.route('/', attendanceRecordRoutes);

export default attendanceRoutes;
