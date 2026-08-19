import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the project root (one level up from frontend)
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config(); // Fallback to current directory

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.warn(
    "[MindSense] MONGO_URI is not set. Database features will not work.\n" +
    "Add MONGO_URI to your .env file."
  );
}

// Extend global to cache connection across hot-reloads in development
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("MongoDB Connected Successfully 🚀");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
};