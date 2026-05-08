import { z } from "@hono/zod-openapi";

export const AttendanceRecordSchema = z.object({
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
  attendance_id: z.string().uuid().openapi({
    description: 'The attendance ID this record belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
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

export const GetAttendanceRecordSchema = AttendanceRecordSchema.openapi('GetAttendanceRecord');
export const PostAttendanceRecordSchema = AttendanceRecordSchema.openapi('PostAttendanceRecord');
export const PatchAttendanceRecordSchema = AttendanceRecordSchema
  .omit({ id: true, created_at: true })
  .partial()
  .openapi('PatchAttendanceRecord');

export const GetAttendanceRecordsQuerySchema = z.object({
  q: z.string().optional(),
}).openapi('GetAttendanceRecordsQuery');

// Types
export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;
export type GetAttendanceRecord = z.infer<typeof GetAttendanceRecordSchema>;
export type PostAttendanceRecord = z.infer<typeof PostAttendanceRecordSchema>;
export type PatchAttendanceRecord = z.infer<typeof PatchAttendanceRecordSchema>;
export type GetAttendanceRecordsQuery = z.infer<typeof GetAttendanceRecordsQuerySchema>;