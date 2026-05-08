import { Context } from "hono";
import { getAttendees } from "../attendees.service.js";
import { GetAttendeesQuerySchema } from "../attendees.model.js";

export async function getAttendeesController(c: Context) {
  try {
    const attendanceId = c.req.param('id');
    
    // Parse query with coerce to convert string numbers to actual numbers
    const query = GetAttendeesQuerySchema.parse({
      q: c.req.query('q') ?? '',
      department: c.req.query('department') ?? '',
      year_level: c.req.query('year_level') ?? '',
      section: c.req.query('section') ?? '',
      page: c.req.query('page') ? parseInt(c.req.query('page'), 10) : 1,
      limit: c.req.query('limit') ? parseInt(c.req.query('limit'), 10) : 10,
    });
    
    const result = await getAttendees(attendanceId, query);
    
    // Return paginated response
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    
    return c.json({
      data: result.data,
      total: result.total,
      page,
      limit,
    }, 200);
  } catch (error) {
    console.error('Error fetching attendees:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch attendees';
    return c.json({ error: errorMessage }, 500);
  }
}
