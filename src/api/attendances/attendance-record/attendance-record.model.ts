import { z } from "@hono/zod-openapi";

export const AttendanceRecordStatusSchema = z.enum(['present', 'late', 'excused', 'absent']);
export const AttendanceRecordReasonTypeSchema = z.enum(['sick', 'personal', 'excused', 'other']);

export const AttendanceRecordSchema = z.object({
  id: z.uuidv4()
    .default(crypto.randomUUID())
    .openapi({
      description: 'The unique identifier for the attendance record',
    }),
  attendances_id: z.uuidv4()
    .openapi({
      description: 'The unique identifier for the attendance record',
    }),
  attendance_id: z.uuidv4()
    .openapi({
      description: 'The unique identifier for the attendance record',
    }),
  attendee_id: z.uuidv4()
    .openapi({
      description: 'The unique identifier for the attendee record',
    }),
  status: AttendanceRecordStatusSchema
    .openapi({
      description: 'The status of the attendance record',
    }),
  reason: z.string()
    .optional()
    .nullable()
    .openapi({
      description: 'The reason for the attendance record',
    }),
  reason_type: AttendanceRecordReasonTypeSchema
    .optional()
    .nullable()
    .openapi({
      description: 'The reason type for the attendance record',
    }),
  created_at: z.iso.datetime()
    .default(new Date().toISOString())
    .openapi({
      description: 'The date and time the attendance record was created',
    }),
  updated_at: z.iso.datetime()
    .default(new Date().toISOString())
    .openapi({
      description: 'The date and time the attendance record was last updated',
    }),
}).openapi('AttendanceRecord');

export const GetAttendanceRecordSchema = AttendanceRecordSchema.openapi('GetAttendanceRecord');
export const PostAttendanceRecordSchema = AttendanceRecordSchema.openapi('PostAttendanceRecord');
export const PatchAttendanceRecordSchema = AttendanceRecordSchema
  .omit({ id: true, created_at: true })
  .partial()
  .openapi('PatchAttendanceRecord');
export const DeleteAttendanceRecordSchema = AttendanceRecordSchema.pick({ id: true }).openapi('DeleteAttendanceRecord');

// Types
export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;
export type GetAttendanceRecord = z.infer<typeof GetAttendanceRecordSchema>;
export type PostAttendanceRecord = z.infer<typeof PostAttendanceRecordSchema>;
export type PatchAttendanceRecord = z.infer<typeof PatchAttendanceRecordSchema>;
export type DeleteAttendanceRecord = z.infer<typeof DeleteAttendanceRecordSchema>;