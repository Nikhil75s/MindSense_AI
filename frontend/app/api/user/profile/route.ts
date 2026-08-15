import { NextRequest, NextResponse } from "next/server"
import { getAuthSession, clearAuthCookie } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"

export async function GET() {
  try {
    const session = await getAuthSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findById(session.userId).select("-passwordHash -__v")
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, bio, username, newsletter } = await req.json()

    await connectDB()
    const user = await User.findById(session.userId)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (username && username !== user.username) {
      const existing = await User.findOne({ username })
      if (existing) return NextResponse.json({ error: "Username is already taken" }, { status: 409 })
      user.username = username
    }

    if (name) user.name = name
    if (bio !== undefined) user.bio = bio
    if (newsletter !== undefined) user.newsletter = !!newsletter

    await user.save()

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        newsletter: user.newsletter,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getAuthSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    await User.findByIdAndDelete(session.userId)
    await clearAuthCookie()

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
