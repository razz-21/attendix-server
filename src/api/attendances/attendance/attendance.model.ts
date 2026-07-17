import { z } from "@hono/zod-openapi";

export const AttendanceSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()).openapi({
    description: 'The unique identifier for the attendance record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  name: z.string().trim().min(1, 'Name is required').openapi({
    description: 'The name of the attendance record',
    example: 'Session 1',
  }),
  attendance_date: z.string().trim().min(1, 'Attendance date is required').openapi({
    description: 'The date of the attendance session',
    example: '2025-01-01',
  }),
  start_time: z.string().trim().min(1, 'Start time is required').openapi({
    description: 'Start time of the session',
    example: '09:00 AM',
  }),
  end_time: z.string().trim().min(1, 'End time is required').openapi({
    description: 'End time of the session',
    example: '10:00 AM',
  }),
  attendance_id: z.uuidv4().openapi({
    description: 'The attendance ID this record belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  attendances_id: z.uuidv4().openapi({
    description: 'The attendances ID this record belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  status: z.enum(['active', 'inactive']).default('active').openapi({
    description: 'The status of the attendance record',
    example: 'active',
  }),
  enable_otc: z.enum(['on', 'off']).default('off').openapi({
    description: 'The on/off state of the attendance session',
    example: 'off',
  }),
  otc_code: z.int().optional().openapi({
    description: 'The OTP code for the attendance session',
    example: 123,
  }),
  otc_code_expires_at: z.string().datetime().optional().openapi({
    description: 'The date and time the OTP code expires',
    example: '2021-01-01T00:00:00.000Z',
  }),
  created_at: z.string().datetime().default(() => new Date().toISOString()).openapi({
    description: 'The date and time the record was created',
    example: '2021-01-01T00:00:00.000Z',
  }),
  updated_at: z.string().datetime().default(() => new Date().toISOString()).openapi({
    description: 'The date and time the record was last updated',
    example: '2021-01-01T00:00:00.000Z',
  }),
}).openapi('AttendanceRecord');

export const GetAttendanceSchema = AttendanceSchema.openapi('GetAttendance');
export const PostAttendanceSchema = AttendanceSchema.openapi('PostAttendance');
export const PatchAttendanceSchema = AttendanceSchema
  .omit({ id: true, created_at: true })
  .partial()
  .openapi('PatchAttendance');

export const GetAttendancesQuerySchema = z.object({
  q: z.string().optional(),
}).openapi('GetAttendancesQuery');

// Types
export type Attendance = z.infer<typeof AttendanceSchema>;
export type GetAttendance = z.infer<typeof GetAttendanceSchema>;
export type PostAttendance = z.infer<typeof PostAttendanceSchema>;
export type PatchAttendance = z.infer<typeof PatchAttendanceSchema>;
export type GetAttendancesQuery = z.infer<typeof GetAttendancesQuerySchema>;