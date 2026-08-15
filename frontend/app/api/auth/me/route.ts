import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"

export async function GET() {
  try {
    const session = await getAuthSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.userId).select("-passwordHash -__v")
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth session error:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}
