import { OpenAPIHono } from "@hono/zod-openapi";
import { GetAttendanceRecordsRoute } from "./get-attendances/get-attendance.route.js";
import { getAttendanceRecordsController } from "./get-attendances/get-attendance.controller.js";
import { GetAttendanceRecordRoute } from "./get-attendance/get-attendance.route.js";
import { getAttendanceRecordController } from "./get-attendance/get-attendance.controller.js";
import { PostAttendanceRecordRoute } from "./post-attendance/post-attendance-record.route.js";
import { postAttendanceRecordController } from "./post-attendance/post-attendance-record.controller.js";
import { PatchAttendanceRecordRoute } from "./patch-attendance/patch-attendance.route.js";
import { patchAttendanceRecordController } from "./patch-attendance/patch-attendance.controller.js";
import { DeleteAttendanceRecordRoute } from "./delete-attendance/delete-attendance.route.js";
import { deleteAttendanceRecordController } from "./delete-attendance/delete-attendance.controller.js";

const attendanceRoutes = new OpenAPIHono();

attendanceRoutes.openapi(GetAttendanceRecordsRoute, getAttendanceRecordsController);
attendanceRoutes.openapi(GetAttendanceRecordRoute, getAttendanceRecordController);
attendanceRoutes.openapi(PostAttendanceRecordRoute, postAttendanceRecordController);
attendanceRoutes.openapi(PatchAttendanceRecordRoute, patchAttendanceRecordController);
attendanceRoutes.openapi(DeleteAttendanceRecordRoute, deleteAttendanceRecordController);

export default attendanceRoutes;