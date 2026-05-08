import { OpenAPIHono } from "@hono/zod-openapi";
import { GetAttendanceRecordsRoute } from "./get-attendance-records/get-attendance-records.route.js";
import { getAttendanceRecordsController } from "./get-attendance-records/get-attendance-records.controller.js";
import { GetAttendanceRecordRoute } from "./get-attendance-record/get-attendance-record.route.js";
import { getAttendanceRecordController } from "./get-attendance-record/get-attendance-record.controller.js";
import { PostAttendanceRecordRoute } from "./post-attendance-record/post-attendance-record.route.js";
import { postAttendanceRecordController } from "./post-attendance-record/post-attendance-record.controller.js";
import { PatchAttendanceRecordRoute } from "./patch-attendance-record/patch-attendance-record.route.js";
import { patchAttendanceRecordController } from "./patch-attendance-record/patch-attendance-record.controller.js";
import { DeleteAttendanceRecordRoute } from "./delete-attendance-record/delete-attendance-record.route.js";
import { deleteAttendanceRecordController } from "./delete-attendance-record/delete-attendance-record.controller.js";

const attendanceRecordRoutes = new OpenAPIHono();

attendanceRecordRoutes.openapi(GetAttendanceRecordsRoute, getAttendanceRecordsController);
attendanceRecordRoutes.openapi(GetAttendanceRecordRoute, getAttendanceRecordController);
attendanceRecordRoutes.openapi(PostAttendanceRecordRoute, postAttendanceRecordController);
attendanceRecordRoutes.openapi(PatchAttendanceRecordRoute, patchAttendanceRecordController);
attendanceRecordRoutes.openapi(DeleteAttendanceRecordRoute, deleteAttendanceRecordController);

export default attendanceRecordRoutes;