import mongoose from "mongoose";
import type { Db } from "mongodb";

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConn: Promise<typeof mongoose> | null;
};

if (!globalForMongoose.mongooseConn) {
  globalForMongoose.mongooseConn = null;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Only throw at runtime when connect is called; build can pass without env
  console.warn("MONGODB_URI is not set");
}

/**
 * Single shared Mongoose connection for Next.js (survives HMR via global cache).
 */
export async function connectMongoose(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (!globalForMongoose.mongooseConn) {
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
    };
    if (process.env.MONGODB_DB) {
      options.dbName = process.env.MONGODB_DB;
    }
    globalForMongoose.mongooseConn = mongoose.connect(MONGODB_URI, options);
  }

  await globalForMongoose.mongooseConn;
  return mongoose;
}

/**
 * Native Mongo `Db` for Better Auth's `mongodbAdapter` (same pool as Mongoose).
 */
export function getMongoDb(): Db {
  if (mongoose.connection.readyState < 1) {
    throw new Error("connectMongoose() must be called before getMongoDb()");
  }
  const name = process.env.MONGODB_DB;
  if (name) {
    return mongoose.connection.getClient().db(name) as unknown as Db;
  }
  if (mongoose.connection.db) {
    return mongoose.connection.db as unknown as Db;
  }
  throw new Error("Could not resolve MongoDB database");
}
