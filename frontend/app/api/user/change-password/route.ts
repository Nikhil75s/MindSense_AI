import { NextRequest, NextResponse } from "next/server"
import { getAuthSession, comparePassword, hashPassword } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(session.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 })
    }

    user.passwordHash = await hashPassword(newPassword)
    await user.save()

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
