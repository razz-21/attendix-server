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
import attendanceRecordRoutes from "./attendance-records/attendance-record.routes.js";

const attendanceRoutes = new OpenAPIHono();

attendanceRoutes.openapi(GetAttendancesRoute, getAttendances);
attendanceRoutes.openapi(GetAttendanceRoute, getAttendance);
attendanceRoutes.openapi(PostAttendanceRoute, postAttendance);
attendanceRoutes.openapi(PatchAttendanceRoute, patchAttendance);
attendanceRoutes.openapi(DeleteAttendanceRoute, deleteAttendance);

attendanceRoutes.route('/', attendanceRecordRoutes);


export default attendanceRoutes;
