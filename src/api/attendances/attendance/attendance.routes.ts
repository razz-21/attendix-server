import { OpenAPIHono } from "@hono/zod-openapi";
import { GetAttendancesRoute } from "./get-attendances/get-attendances.route.js";
import { getAttendancesController } from "./get-attendances/get-attendances.controller.js";
import { GetAttendanceRoute } from "./get-attendance/get-attendance.route.js";
import { getAttendanceController } from "./get-attendance/get-attendance.controller.js";
import { PostAttendanceRoute } from "./post-attendance/post-attendance-record.route.js";
import { postAttendanceController } from "./post-attendance/post-attendance-record.controller.js";
import { PatchAttendanceRoute } from "./patch-attendance/patch-attendance.route.js";
import { patchAttendanceController } from "./patch-attendance/patch-attendance.controller.js";
import { DeleteAttendanceRoute } from "./delete-attendance/delete-attendance.route.js";
import { deleteAttendanceController } from "./delete-attendance/delete-attendance.controller.js";

const attendanceRoutes = new OpenAPIHono();

attendanceRoutes.openapi(GetAttendancesRoute, getAttendancesController);
attendanceRoutes.openapi(GetAttendanceRoute, getAttendanceController);
attendanceRoutes.openapi(PostAttendanceRoute, postAttendanceController);
attendanceRoutes.openapi(PatchAttendanceRoute, patchAttendanceController);
attendanceRoutes.openapi(DeleteAttendanceRoute, deleteAttendanceController);

export default attendanceRoutes;