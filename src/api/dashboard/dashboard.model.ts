import { z } from "@hono/zod-openapi";

export const DashboardResponseSchema = z.object({
  suggested_groups: z.array(z.any()),
  recent_attendances: z.array(z.any()),
}).openapi('DashboardResponse');

export type DashboardResponse = z.infer<typeof DashboardResponseSchema>;