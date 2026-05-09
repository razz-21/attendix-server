import { z } from "@hono/zod-openapi";

export const AttendanceScheduleDaysSchema = z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).openapi({
  description: 'Days of the week when attendance is tracked',
});

export const AttendanceStatusSchema = z.enum(['active', 'archived']).openapi({
  description: 'The status of the attendance record',
});

export const AttendanceSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the attendance record',
  }),
  name: z.string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .openapi({
      description: 'The name of the attendance configuration',
    }
  ),
  code: z.string('Code is required')
    .trim()
    .min(1, 'Code is required')
    .openapi({
      description: 'Short code identifier for the attendance',
    }
  ),
  description: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'A brief description of the attendance configuration',
    }
  ),
  schedule_days: AttendanceScheduleDaysSchema
    .min(1, 'At least one schedule day is required')
    .openapi({
      description: 'Days of the week when attendance is tracked',
    }
  ),
  late_threshold: z.number('Late threshold is required')
    .int()
    .min(0, 'Late threshold must be a non-negative integer')
    .openapi({
      description: 'Number of minutes after start_time before a student is considered late',
    }
  ),
  status: AttendanceStatusSchema,
  created_by: z.uuidv4().openapi({
    description: 'UUID of the user who created this attendance record',
  }),
  created_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the record was created',
    }
  ),
  updated_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the record was last updated',
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
  status: AttendanceStatusSchema.optional(),
}).openapi('GetAttendancesQuery');

// Types
export type Attendance = z.infer<typeof AttendanceSchema>;
export type GetAttendance = z.infer<typeof GetAttendanceSchema>;
export type PostAttendance = z.infer<typeof PostAttendanceSchema>;
export type PatchAttendance = z.infer<typeof PatchAttendanceSchema>;
export type DeleteAttendance = z.infer<typeof DeleteAttendanceSchema>;
export type GetAttendancesQuery = z.infer<typeof GetAttendancesQuerySchema>;
