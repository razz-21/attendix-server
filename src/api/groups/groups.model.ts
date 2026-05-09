import { z } from "@hono/zod-openapi";

export const GroupSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the group',
  }),
  name: z.string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .openapi({
      description: 'The name of the group',
    }),
  description: z.string().trim().optional().openapi({
    description: 'The description of the group',
  }),
  workspace_id: z.uuidv4().openapi({
    description: 'The unique identifier for the workspace',
  }),
  created_by: z.uuidv4().openapi({
    description: 'The unique identifier for the user who created the group',
  }),
  created_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the group was created',
    }
  ),
  updated_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the group was last updated',
    }
  ),
}).openapi('Group');

export const GetGroupSchema = GroupSchema.openapi('GetGroup');
export const PostGroupSchema = GroupSchema.openapi('PostGroup');
export const PatchGroupSchema = GroupSchema.partial().openapi('PatchGroup');
export const DeleteGroupSchema = GroupSchema.pick({ id: true }).openapi('DeleteGroup');

export const GetPaginatedGroupParamsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),  
  q: z.string().optional(),
  workspace_id: z.string().optional(),
}).openapi('GetPaginatedGroupParams');

export const GetPaginatedGroupsSchema = z.object({
  data: z.array(GetGroupSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
}).openapi('GetPaginatedGroups');

// Types
export type GetGroup = z.infer<typeof GetGroupSchema>;
export type PostGroup = z.infer<typeof PostGroupSchema>;
export type PatchGroup = z.infer<typeof PatchGroupSchema>;
export type DeleteGroup = z.infer<typeof DeleteGroupSchema>;
export type GetPaginatedGroupParams = z.infer<typeof GetPaginatedGroupParamsSchema>;
export type GetPaginatedGroups = z.infer<typeof GetPaginatedGroupsSchema>;