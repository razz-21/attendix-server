import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { getDb } from "../../config/db.config.js";

export async function getDashboardData(user: { id: string; workspace_id?: string | null }): Promise<{ suggested_groups: any[]; recent_attendances: any[] }> {
  try {
    const db = getDb();

    // Same visibility rule as getGroups: own groups + shared workspace groups
    const ownershipFilter = {
      $or: [
        { created_by: user.id },
        ...(user.workspace_id ? [{ workspace_id: user.workspace_id }] : []),
      ],
    };

    const groups = await db.collection(COLLECTIONS.GROUPS)
      .find(ownershipFilter)
      .sort({ updated_at: -1 })
      .limit(6)
      .toArray();

    const attendances = await db.collection(COLLECTIONS.ATTENDANCES)
      .find({
        $and: [
          { status: 'active' },
          { created_by: user.id }
        ]
      })
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