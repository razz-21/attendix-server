import { getDb } from "../../../config/db.config.js";
import { COLLECTIONS } from "../../../constants/collectionts.constant.js";
import { ForgotPassword } from "./forgot-password.model.js";
import { isUserEmailExists } from "../../users/users.services.js";
import { sign, verify } from "hono/jwt";
import { sendResetPasswordEmail } from "../email.service.js";
import { GetUser } from "../../users/users.model.js";
import { hashSync } from "bcrypt-ts";

const getExpirationDate = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export async function createForgotPasswordRecord(email: string): Promise<boolean> {
  const db = getDb();
  const usersCollection = db.collection<GetUser>(COLLECTIONS.USERS);

  const user = await usersCollection.findOne({ email });
  if (!user) {
    throw new Error("this email does not exist");
  }

  const tokenSecret = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
  const token = await sign(
    { sub: user.id, type: "forgot_password", exp: Math.floor(Date.now() / 1000) + 15 * 60 },
    tokenSecret,
    "HS256"
  );

  const recordId = crypto.randomUUID();
  const record: ForgotPassword = {
    id: recordId,
    user_id: user.id,
    token,
    status: "Active",
    expired_in: getExpirationDate(15),
    created_at: new Date(),
  };

  const forgotPasswordCollection = db.collection<ForgotPassword>(COLLECTIONS.FORGOT_PASSWORD);
  await forgotPasswordCollection.insertOne(record);

  await sendResetPasswordEmail(email, token, user.firstname);

  return true;
}

export async function verifyForgotPasswordToken(token: string): Promise<{ valid: boolean, userId?: string }> {
  try {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET || "access_token_secret";
    const payload = await verify(token, tokenSecret, "HS256");

    const db = getDb();
    const forgotPasswordCollection = db.collection<ForgotPassword>(COLLECTIONS.FORGOT_PASSWORD);

    const record = await forgotPasswordCollection.findOne({ token, status: "Active" });
    if (!record) {
      return { valid: false };
    }

    if (new Date() > record.expired_in) {
      return { valid: false };
    }

    return { valid: true, userId: record.user_id };
  } catch (error) {
    return { valid: false };
  }
}

export async function resetUserPassword(token: string, newPassword: string): Promise<boolean> {
  const { valid, userId } = await verifyForgotPasswordToken(token);
  if (!valid || !userId) {
    throw new Error("Invalid or expired token");
  }

  const db = getDb();

  // Update user password
  const usersCollection = db.collection<GetUser>(COLLECTIONS.USERS);
  const hashedPassword = hashSync(newPassword, 10);

  const updateResult = await usersCollection.updateOne(
    { id: userId },
    { $set: { password: hashedPassword } }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error("Failed to update password");
  }

  // Mark token as Verified
  const forgotPasswordCollection = db.collection<ForgotPassword>(COLLECTIONS.FORGOT_PASSWORD);
  await forgotPasswordCollection.updateOne(
    { token },
    { $set: { status: "Verified" } }
  );

  return true;
}
