import { COLLECTIONS } from "../../constants/collectionts.constant.js";
import { getDb } from "../../config/db.config.js";
import { Attendance } from "../attendances/attendance.model.js";
import { buildAttendanceAccessFilter } from "../attendances/attendance.service.js";

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

    const attendances = await db.collection<Attendance>(COLLECTIONS.ATTENDANCES)
      .find({
        $and: [
          { status: 'active' },
          buildAttendanceAccessFilter(user),
        ],
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

export async function searchAttendances(
  q: string,
  user: { id: string; workspace_id?: string | null },
): Promise<any[]> {
  try {
    const db = getDb();
    const searchQuery = q.trim();
    const attendances = await db.collection<Attendance>(COLLECTIONS.ATTENDANCES)
      .find({
        $and: [
          buildAttendanceAccessFilter(user),
          {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } },
              { code: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      })
      .sort({ updated_at: -1 })
      .toArray();
    return attendances;
  } catch (error) {
    throw new Error('Failed to search attendances');
  }
}