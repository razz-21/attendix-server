import { Context } from "hono";

export async function getOtcController(c: Context) {
  try {
    const attendance_id = c.req.param('attendance_id') ?? '';
    const now = Math.floor(Date.now() / 1000);
    const window = Math.floor(now / 15);
    
    const seed = attendance_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const otc = String((window * 7919 + seed * 123) % 1000).padStart(3, "0");
    const expires_in = 15 - (now % 15);

    return c.json({ otc, expires_in }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to generate OTC' }, 500);
  }
}