import { Context } from "hono";
import { getAttendeeById } from "../attendees.service.js";

export async function getAttendeeController(c: Context) {
  try {
    const attendancesId = c.req.param('attendances_id');
    const attendeeId = c.req.param('attendee_id');
    
    if (!attendancesId || !attendeeId) {
      return c.json({ error: 'Missing required parameters' }, 400);
    }
    
    const attendee = await getAttendeeById(attendancesId, attendeeId);
    
    if (!attendee) {
      return c.json({ error: 'Attendee not found' }, 404);
    }
    
    return c.json(attendee, 200);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch attendee';
    return c.json({ error: errorMessage }, 500);
  }
}
