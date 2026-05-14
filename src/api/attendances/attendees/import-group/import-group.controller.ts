import { RouteHandler } from "@hono/zod-openapi";
import { ImportGroupRoute } from "./import-group.route.js";
import { importGroupAttendees } from "../attendees.service.js";

export const importGroupController: RouteHandler<typeof ImportGroupRoute> = async (c) => {
  try {
    const { attendances_id } = c.req.valid('param');
    const { group_id } = c.req.valid('json');

    const result = await importGroupAttendees(attendances_id, group_id);
    return c.json(result, 200);
  } catch (error) {
    console.error('importGroupController error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    
    if (message.includes('not found') || message.includes('empty')) {
      return c.json({ error: message }, 404);
    }
    
    return c.json({ error: message }, 500);
  }
};
