import { z } from "@hono/zod-openapi";

export const WorkspaceSchema = z.object({
  id: z.uuidv4().default(crypto.randomUUID()).openapi({
    description: 'The unique identifier for the workspace',
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  name: z.string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .openapi({
      description: 'The name of the workspace',
      example: 'Workspace 1',
    }
  ),
  description: z.string()
    .trim()
    .optional()
    .openapi({
      description: 'The description of the workspace',
      example: 'This is a workspace description',
    }
  ),
  avatar: z.string()
    .trim()
    .openapi({
      description: 'The avatar of the workspace',
      example: 'https://example.com/avatar.png',
    }
  ),
  created_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the workspace was created',
      example: '2021-01-01T00:00:00.000Z',
    }
  ),
  updated_at: z.iso.datetime().default(new Date().toISOString())
    .openapi({
      description: 'The date and time the workspace was last updated',
      example: '2021-01-01T00:00:00.000Z',
    }
  ),
}).openapi('Workspace');

export const GetWorkspaceSchema = WorkspaceSchema.openapi('GetWorkspace');
export const PostWorkspaceSchema = WorkspaceSchema.openapi('PostWorkspace');
export const PatchWorkspaceSchema = WorkspaceSchema.omit({ id: true, created_at: true }).partial().openapi('PatchWorkspace');
export const DeleteWorkspaceSchema = WorkspaceSchema.pick({ id: true }).openapi('DeleteWorkspace');
export const GetPaginatedWorkspaceParamsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  q: z.string().optional(),
}).openapi('GetPaginatedWorkspaceParams');
export const GetPaginatedWorkspaceSchema = z.object({
  data: z.array(GetWorkspaceSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
}).openapi('GetPaginatedWorkspace');

// Types
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type GetWorkspace = z.infer<typeof GetWorkspaceSchema>;
export type PostWorkspace = z.infer<typeof PostWorkspaceSchema>;
export type PatchWorkspace = z.infer<typeof PatchWorkspaceSchema>;
export type DeleteWorkspace = z.infer<typeof DeleteWorkspaceSchema>;
export type GetPaginatedWorkspaceParams = z.infer<typeof GetPaginatedWorkspaceParamsSchema>;
export type GetPaginatedWorkspace = z.infer<typeof GetPaginatedWorkspaceSchema>;