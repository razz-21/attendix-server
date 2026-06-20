import { z } from "@hono/zod-openapi";

export const PatchMePasswordSchema = z.object({
  current_password: z.string('Current password is required')
    .trim()
    .min(1, 'Current password is required')
    .openapi({
      description: 'The current password of the user',
    }),
  new_password: z.string('New password is required')
    .trim()
    .min(1, 'New password is required')
    .openapi({
      description: 'The new password of the user',
    }),
  confirm_new_password: z.string('Confirm new password is required')
    .trim()
    .min(1, 'Confirm new password is required')
    .openapi({
      description: 'The confirm new password of the user',
    }),
}).openapi('PatchMePassword');

export type PatchMePassword = z.infer<typeof PatchMePasswordSchema>;