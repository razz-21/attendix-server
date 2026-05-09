import { Context } from "hono";
import { PatchAttendee, PatchAttendeeSchema } from "../attendees.model.js";
import { updateAttendee } from "../attendees.service.js";
import { ZodError } from "zod";

export async function patchAttendeeController(c: Context) {
  try {
    const attendanceId = c.req.param('id');
    const attendeeId = c.req.param('attendees_record_id');
    if (!attendanceId || !attendeeId) {
      return c.json({ error: 'Attendance id and attendee id are required' }, 400);
    }

    const payload = PatchAttendeeSchema.parse(await c.req.json<PatchAttendee>());
    
    const attendee = await updateAttendee(attendanceId, attendeeId, payload);
    
    if (!attendee) {
      return c.json({ error: 'Attendee not found' }, 404);
    }
    
    return c.json(attendee, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to update attendee';
    
    // Check if it's a duplicate RFID error
    if (errorMessage.includes('RFID already exists')) {
      return c.json({ error: errorMessage }, 409); // Conflict status code
    }
    
    return c.json({ error: errorMessage }, 500);
  }
}
