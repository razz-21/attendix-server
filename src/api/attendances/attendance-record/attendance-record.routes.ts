import { OpenAPIHono } from "@hono/zod-openapi";
import { getAttendanceRecordController } from "./get-attendance-record/get-attendance-record.controller.js";
import { GetAttendanceRecordRoute } from "./get-attendance-record/get-attendance-record.route.js";
import { PostAttendanceRecordRoute } from "./post-attendance-record/post-attendance-record.route.js";
import { postAttendanceRecordController } from "./post-attendance-record/post-attendance-record.controller.js";
import { PatchAttendanceRecordRoute } from "./patch-attendance-record/patch-attendance-record.route.js";
import { patchAttendanceRecordController } from "./patch-attendance-record/patch-attendance-record.controller.js";

const attendanceRecordRoutes = new OpenAPIHono();

attendanceRecordRoutes.openapi(GetAttendanceRecordRoute, getAttendanceRecordController);
attendanceRecordRoutes.openapi(PostAttendanceRecordRoute, postAttendanceRecordController);
attendanceRecordRoutes.openapi(PatchAttendanceRecordRoute, patchAttendanceRecordController);

export default attendanceRecordRoutes;