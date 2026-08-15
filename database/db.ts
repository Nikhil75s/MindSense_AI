import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI ?? ""

if (!MONGODB_URI) {
  console.warn(
    "[MindSense] MONGODB_URI is not set. Authentication features will not work.\n" +
    "Add MONGODB_URI to your .env.local file."
  )
}

// Extend global to cache connection across hot-reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const cached = global._mongoose ?? { conn: null, promise: null }
global._mongoose = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}
