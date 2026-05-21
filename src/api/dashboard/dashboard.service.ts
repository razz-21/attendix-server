import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { getDb } from "../../config/db.config.js";

export async function getDashboardData(): Promise<{ suggested_groups: any[]; recent_attendances: any[] }> {
  try {
    const db = getDb();

    const groups = await db.collection(COLLECTIONS.GROUPS)
      .find({})
      .sort({ updated_at: -1 })
      .limit(6)
      .toArray();

    const attendances = await db.collection(COLLECTIONS.ATTENDANCES)
      .find({ status: 'active' })
      .sort({ updated_at: -1 })
      .limit(8)
      .toArray();

    return {
      suggested_groups: groups,
      recent_attendances: attendances,
    };
  } catch (error) {
    throw new Error('Failed to get dashboard data');
  }
}

export async function searchAttendances(q: string): Promise<any[]> {
  try {
    const db = getDb();
    const attendances = await db.collection(COLLECTIONS.ATTENDANCES)
      .find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { code: { $regex: q, $options: 'i' } },
        ]
      })
      .sort({ updated_at: -1 })
      .toArray();
    return attendances;
  } catch (error) {
    throw new Error('Failed to search attendances');
  }
}