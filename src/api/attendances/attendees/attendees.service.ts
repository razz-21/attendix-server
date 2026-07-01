import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { getDb } from "../../../config/db.config.js";
import { GetAttendee, GetAttendeesQuery, PatchAttendee, PostAttendee, ImportGroupResponse } from "./attendees.model.js";
import { Filter } from "mongodb";
import { GetGroupMember } from "../../groups/group-member/groups-member.model.js";

export async function getAttendeeById(attendanceId: string, attendeeId: string): Promise<GetAttendee | null> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    const attendee = await collection.findOne<GetAttendee>({ 
      id: attendeeId,
      attendance_id: attendanceId 
    });
    return attendee;
  } catch (error) {
    throw new Error('Failed to get attendee by id');
  }
}

export async function getAttendees(attendanceId: string, params: GetAttendeesQuery): Promise<{ data: GetAttendee[]; total: number }> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    const searchQuery = params.q?.trim();

    const filter: Filter<GetAttendee> = {
      attendance_id: attendanceId,
    };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { rfid: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (params.department) {
      filter.department = params.department;
    }

    if (params.year_level) {
      filter.year_level = params.year_level;
    }

    if (params.section) {
      filter.section = params.section;
    }

    // Get total count
    const total = await collection.countDocuments(filter);

    // Implement pagination with proper defaults
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.max(1, params.limit ?? 10);
    const skip = (page - 1) * limit;

    const attendees = await collection
      .find<GetAttendee>(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return { data: attendees, total };
  } catch (error) {
    console.error('Error in getAttendees:', error);
    throw new Error('Failed to get attendees');
  }
}

export async function createAttendee(payload: PostAttendee): Promise<GetAttendee> {
  try {
    const db = getDb();
    const collection = db.collection<PostAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    
    // Check if RFID already exists for this attendance (if RFID is provided)
    if (payload.rfid?.trim()) {
      const existingAttendee = await collection.findOne({
        attendance_id: payload.attendance_id,
        rfid: payload.rfid.trim(),
      });
      if (existingAttendee) {
        throw new Error('RFID already exists for this attendance');
      }
    }
    
    const attendee: GetAttendee = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await collection.insertOne(attendee as any);
    if (!result.acknowledged) {
      throw new Error('Failed to create attendee');
    }

    return attendee;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create attendee';
    throw new Error(message);
  }
}

export async function updateAttendee(attendanceId: string, attendeeId: string, payload: PatchAttendee): Promise<GetAttendee | null> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    
    // Check if RFID already exists for this attendance if RFID is being updated
    if (payload.rfid?.trim()) {
      const existingAttendee = await collection.findOne({
        attendance_id: attendanceId,
        rfid: payload.rfid.trim(),
        id: { $ne: attendeeId }, // Exclude current attendee
      });
      if (existingAttendee) {
        throw new Error('RFID already exists for this attendance');
      }
    }
    
    const updatePayload = {
      ...payload,
      updated_at: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { 
        id: attendeeId,
        attendance_id: attendanceId 
      },
      { $set: updatePayload },
      { returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update attendee';
    throw new Error(message);
  }
}

export async function deleteAttendee(attendanceId: string, attendeeId: string): Promise<boolean> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    
    const result = await collection.deleteOne({
      id: attendeeId,
      attendance_id: attendanceId 
    });

    return result.deletedCount > 0;
  } catch (error) {
    throw new Error('Failed to delete attendee');
  }
}

export async function bulkDeleteAttendeesByIds(attendanceId: string, ids: string[]): Promise<number> {
  try {
    const db = getDb();
    const collection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    const result = await collection.deleteMany({
      id: { $in: ids },
      $or: [
        { attendance_id: attendanceId },
        { attendances_id: attendanceId },
      ],
    });
    return result.deletedCount;
  } catch (error) {
    throw new Error('Failed to delete attendees');
  }
}

export async function importGroupAttendees(attendanceId: string, groupId: string): Promise<ImportGroupResponse> {
  try {
    const db = getDb();
    
    // Fetch group members
    const groupMembersCollection = db.collection<GetGroupMember>(COLLECTIONS.GROUP_MEMBERS);
    const members = await groupMembersCollection.find({ group_id: groupId }).toArray();

    if (!members.length) {
      throw new Error('Group is empty or does not exist');
    }

    // Fetch existing attendees to prevent duplicates by RFID
    const attendeesCollection = db.collection<GetAttendee>(COLLECTIONS.ATTENDANCE_ATTENDEES);
    const existingAttendees = await attendeesCollection.find({ attendance_id: attendanceId }).toArray();
    
    // We can only deduplicate based on RFIDs since names can overlap but RFID is strictly unique
    const existingRfids = new Set(
      existingAttendees
        .map(a => a.rfid?.trim())
        .filter(rfid => rfid !== undefined && rfid !== '')
    );

    const newAttendees: GetAttendee[] = [];
    const now = new Date();

    for (const member of members) {
      const rfid = member.rfid?.trim();
      
      // Skip if RFID exists and is non-empty
      if (rfid && existingRfids.has(rfid)) {
        continue;
      }
      
      newAttendees.push({
        id: crypto.randomUUID(),
        attendance_id: attendanceId,
        attendances_id: attendanceId,
        rfid: member.rfid,
        name: member.name,
        department: member.department,
        year_level: member.year_level,
        section: member.section,
        created_at: now,
        updated_at: now,
      });
    }

    if (newAttendees.length === 0) {
      return { 
        count: 0, 
        message: 'No new attendees to import. All group members might already exist in this attendance.' 
      };
    }

    const result = await attendeesCollection.insertMany(newAttendees);
    if (!result.acknowledged) {
      throw new Error('Failed to import attendees');
    }

    return {
      count: result.insertedCount,
      message: `Successfully imported ${result.insertedCount} attendee(s).`
    };
  } catch (error) {
    console.error('Error in importGroupAttendees:', error);
    const message = error instanceof Error ? error.message : 'Failed to import attendees';
    throw new Error(message);
  }
}
