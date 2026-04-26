import { z } from "@hono/zod-openapi";

export const GroupSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the group',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  student_id: z.string('Student ID is required')
    .trim()
    .min(1, 'Student ID is required')
    .openapi({
      description: 'The unique identifier for the student',
      example: '1234567890',
    }
  ),
  name: z.string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .openapi({
      description: 'The name of the group',
      example: 'Group 1',
    }
  ),
  department: z.string('Department is required')
    .trim()
    .min(1, 'Department is required')
    .openapi({
      description: 'The department of the group',
      example: 'College of Information Technology',
    }
  ),
  section: z.string('Section is required')
    .trim()
    .min(1, 'Section is required')
    .openapi({
      description: 'The section of the group',
      example: 'Section 1',
    }
  ),
  year_level: z.string('Year level is required')
    .trim()
    .min(1, 'Year level is required')
    .openapi({
      description: 'The year level of the group',
      example: '1',
    }
  ),
  created_by: z.uuidv4().openapi({
    description: 'The unique identifier for the user who created the group',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  workspace_id: z.uuidv4().openapi({
    description: 'The unique identifier for the workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  created_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the group was created',
      example: '2021-01-01T00:00:00.000Z',
    }
  ),
  updated_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the group was last updated',
      example: '2021-01-01T00:00:00.000Z',
    }
  ),
}).openapi('Group');

export const GetGroupSchema = GroupSchema.omit({ student_id: true }).openapi('GetGroup');
export const PostGroupSchema = GroupSchema.omit({ id: true, created_at: true }).openapi('PostGroup');
export const PatchGroupSchema = GroupSchema.omit({ id: true, created_at: true }).partial().openapi('PatchGroup');
export const DeleteGroupSchema = GroupSchema.pick({ id: true }).openapi('DeleteGroup');

export const GetPaginatedGroupParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  q: z.string().optional(),
  workspace_id: z.string().optional(),
  departmenr: z.string().optional(),
}).openapi('GetPaginatedGroupParams');

export const GetPaginatedGroupsSchema = z.object({
  data: z.array(GetGroupSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
}).openapi('GetPaginatedGroups');
