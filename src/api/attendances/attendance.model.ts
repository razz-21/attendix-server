import { z } from "@hono/zod-openapi";

const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const AttendanceSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the attendance record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  name: z.string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .openapi({
      description: 'The name of the attendance configuration',
      example: 'Morning Class Attendance',
    }
  ),
  code: z.string('Code is required')
    .trim()
    .min(1, 'Code is required')
    .openapi({
      description: 'Short code identifier for the attendance',
      example: 'MCA-001',
    }
  ),
  description: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'A brief description of the attendance configuration',
      example: 'Attendance tracking for morning CS101 class',
    }
  ),
  schedule_days: z.array(z.enum(SCHEDULE_DAYS))
    .min(1, 'At least one schedule day is required')
    .openapi({
      description: 'Days of the week when attendance is tracked',
      example: ['Mon', 'Tue', 'Wed'],
    }
  ),
  start_time: z.string('Start time is required')
    .regex(/^\d{2}:\d{2}:\d{2}$/, 'Start time must be in HH:MM:SS format')
    .openapi({
      description: 'The scheduled start time in HH:MM:SS format',
      example: '08:00:00',
    }
  ),
  late_threshold: z.number('Late threshold is required')
    .int()
    .min(0, 'Late threshold must be a non-negative integer')
    .openapi({
      description: 'Number of minutes after start_time before a student is considered late',
      example: 15,
    }
  ),
  created_by: z.uuidv4().openapi({
    description: 'UUID of the user who created this attendance record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  created_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the record was created',
      example: '2021-01-01T00:00:00.000Z',
    }
  ),
  updated_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the record was last updated',
      example: '2021-01-01T00:00:00.000Z',
    }
  ),
}).openapi('Attendance');

export const GetAttendanceSchema = AttendanceSchema.openapi('GetAttendance');
export const PostAttendanceSchema = AttendanceSchema.openapi('PostAttendance');
export const PatchAttendanceSchema = AttendanceSchema
  .omit({ id: true, created_at: true })
  .partial()
  .openapi('PatchAttendance');
export const DeleteAttendanceSchema = AttendanceSchema.pick({ id: true }).openapi('DeleteAttendance');
export const GetAttendancesQuerySchema = z.object({
  q: z.string().optional(),
}).openapi('GetAttendancesQuery');

// Types
export type Attendance = z.infer<typeof AttendanceSchema>;
export type GetAttendance = z.infer<typeof GetAttendanceSchema>;
export type PostAttendance = z.infer<typeof PostAttendanceSchema>;
export type PatchAttendance = z.infer<typeof PatchAttendanceSchema>;
export type DeleteAttendance = z.infer<typeof DeleteAttendanceSchema>;
export type GetAttendancesQuery = z.infer<typeof GetAttendancesQuerySchema>;
