import { Context } from "hono";
import { PostAttendee, PostAttendeeSchema } from "../attendees.model.js";
import { createAttendee } from "../attendees.service.js";
import { ZodError } from "zod";

export async function postAttendeeController(c: Context) {
  try {
    const attendancesId = c.req.param('attendances_id');
    const payload = PostAttendeeSchema.parse(await c.req.json<PostAttendee>());
    
    // Validate that attendance_id in payload matches URL parameter
    if (payload.attendance_id !== attendancesId) {
      return c.json({ error: 'Attendance ID in payload does not match URL parameter' }, 400);
    }
    
    const attendee = await createAttendee(payload);
    return c.json(attendee, 200);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create attendee';
    
    // Check if it's a duplicate RFID error
    if (errorMessage.includes('RFID already exists')) {
      return c.json({ error: errorMessage }, 409); // Conflict status code
    }
    
    return c.json({ error: errorMessage }, 500);
  }
}
