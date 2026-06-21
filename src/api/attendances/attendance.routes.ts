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
import attendeesRoutes from "./attendees/attendees.routes.js";
import attendanceRoutes from "./attendance/attendance.routes.js";
import attendanceRecordRoutes from "./attendance-record/attendance-record.routes.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { publicPostAttendanceRecordRoute } from "./attendance-record/public-post-attendance-record/public-post-attendance-record.route.js";
import { publicPostAttendanceRecordController } from "./attendance-record/public-post-attendance-record/public-post-attendance-record.controller.js";

const attendancesRoutes = new OpenAPIHono()

// Public attendance routes (registered before auth middleware)
attendancesRoutes.openapi(publicPostAttendanceRecordRoute, publicPostAttendanceRecordController);

attendancesRoutes.use("*", authMiddleware);

attendancesRoutes.openapi(GetAttendancesRoute, getAttendances);
attendancesRoutes.openapi(GetAttendanceRoute, getAttendance);
attendancesRoutes.openapi(PostAttendanceRoute, postAttendance);
attendancesRoutes.openapi(PatchAttendanceRoute, patchAttendance);
attendancesRoutes.openapi(DeleteAttendanceRoute, deleteAttendance);

attendancesRoutes.route('/:attendances_id/attendance', attendanceRoutes);
attendancesRoutes.route('/:attendances_id/attendees', attendeesRoutes);
attendancesRoutes.route('/:attendances_id/attendance-record', attendanceRecordRoutes);

export default attendancesRoutes;
