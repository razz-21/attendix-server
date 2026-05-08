import { z } from "@hono/zod-openapi";

export const AttendeeSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the attendee record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  rfid: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'RFID tag identifier for the attendee',
      example: 'RFID123456',
    }
  ),
  name: z.string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .openapi({
      description: 'Full name of the attendee',
      example: 'John Doe',
    }
  ),
  department: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'Department of the attendee',
      example: 'Computer Science',
    }
  ),
  year_level: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'Year level or grade of the attendee',
      example: 'Third Year',
    }
  ),
  section: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'Section or class of the attendee',
      example: 'CS-A',
    }
  ),
  attendance_id: z.uuidv4().openapi({
    description: 'Foreign key reference to the attendance record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  created_at: z.date().default(() => new Date()).openapi({
    description: 'Timestamp when the attendee was created',
    example: '2024-01-15T10:30:00Z',
  }),
  updated_at: z.date().default(() => new Date()).openapi({
    description: 'Timestamp when the attendee was last updated',
    example: '2024-01-15T10:30:00Z',
  }),
});

export type GetAttendee = z.infer<typeof AttendeeSchema>;

export const PostAttendeeSchema = AttendeeSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export type PostAttendee = z.infer<typeof PostAttendeeSchema>;

export const PatchAttendeeSchema = PostAttendeeSchema.partial().omit({
  attendance_id: true,
});

export type PatchAttendee = z.infer<typeof PatchAttendeeSchema>;

export const GetAttendeesQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: 'Search query for name or RFID',
    example: 'John',
  }),
  department: z.string().optional().openapi({
    description: 'Filter by department',
    example: 'Computer Science',
  }),
  year_level: z.string().optional().openapi({
    description: 'Filter by year level',
    example: 'Third Year',
  }),
  section: z.string().optional().openapi({
    description: 'Filter by section',
    example: 'CS-A',
  }),
  page: z.coerce.number().optional().openapi({
    description: 'Page number for pagination (starts at 1)',
    example: 1,
  }),
  limit: z.coerce.number().optional().openapi({
    description: 'Number of items per page',
    example: 10,
  }),
});

export type GetAttendeesQuery = z.infer<typeof GetAttendeesQuerySchema>;
