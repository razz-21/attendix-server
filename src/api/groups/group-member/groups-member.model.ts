import { z } from "@hono/zod-openapi";

export const GroupMemberSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()).openapi({
    description: 'The unique identifier for the group member',
  }),
  rfid: z.string().trim().min(1, 'Student ID is required').openapi({
    description: 'The student ID',
  }),
  name: z.string().trim().min(1, 'Name is required').openapi({
    description: 'The name of the student',
  }),
  department: z.string().trim().optional().openapi({
    description: 'The department of the student',
  }),
  year_level: z.string().trim().optional().openapi({
    description: 'The year level of the student',
  }),
  section: z.string().trim().optional().openapi({
    description: 'The section of the student',
  }),
  group_type: z.enum(['student']).default('student').openapi({
    description: 'The type of the group member',
  }),
  group_id: z.string().uuid().openapi({
    description: 'The group ID this member belongs to',
  }),
  created_at: z.string().datetime().default(() => new Date().toISOString()).openapi({
    description: 'The date and time the member was created',
  }),
  updated_at: z.string().datetime().default(() => new Date().toISOString()).openapi({
    description: 'The date and time the member was last updated',
  }),
}).openapi('GroupMember');

export const GetGroupMemberSchema = GroupMemberSchema.openapi('GetGroupMember');
export const PostGroupMemberSchema = GroupMemberSchema.omit({ id: true, created_at: true, updated_at: true }).openapi('PostGroupMember');
export const ImportGroupMemberSchema = GroupMemberSchema.array().openapi('ImportGroupMember');
export const PatchGroupMemberSchema = GroupMemberSchema.partial().openapi('PatchGroupMember');

export const GetPaginatedGroupMemberParamsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  q: z.string().optional(),
  department: z.string().optional(),
}).openapi('GetPaginatedGroupMemberParams');

export const GetPaginatedGroupMembersSchema = z.object({
  data: z.array(GetGroupMemberSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
}).openapi('GetPaginatedGroupMembers');

export const BulkDeleteGroupMembersSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one member id is required').openapi({
    description: 'The ids of the group members to delete',
  }),
}).openapi('BulkDeleteGroupMembers');

export type GetGroupMember = z.infer<typeof GetGroupMemberSchema>;
export type PostGroupMember = z.infer<typeof PostGroupMemberSchema>;
export type ImportGroupMember = z.infer<typeof ImportGroupMemberSchema>;
export type PatchGroupMember = z.infer<typeof PatchGroupMemberSchema>;
export type GetPaginatedGroupMemberParams = z.infer<typeof GetPaginatedGroupMemberParamsSchema>;
export type GetPaginatedGroupMembers = z.infer<typeof GetPaginatedGroupMembersSchema>;
export type BulkDeleteGroupMembers = z.infer<typeof BulkDeleteGroupMembersSchema>;