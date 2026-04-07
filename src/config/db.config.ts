import { config } from "dotenv";
import { Db, MongoClient } from "mongodb";

config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DATABASE;

if (!mongoUri) {
  throw new Error("Missing MONGO_URI in environment variables");
}

if (!dbName) {
  throw new Error("Missing MONGO_DATABASE in environment variables");
}

let client: MongoClient | null = null;
let db: Db | null = null;

const mongoOptions = {
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 5_000,
};

export const connectDB = async (): Promise<Db> => {
  if (db) return db;

  client = new MongoClient(mongoUri, mongoOptions);
  await client.connect();
  db = client.db(dbName);

  return db;
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("Database is not connected. Call connectDB() first.");
  }

  return db;
};

export const closeDB = async (): Promise<void> => {
  if (!client) return;

  await client.close();
  client = null;
  db = null;
};

const shutdown = async () => {
  await closeDB();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);