import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { signJWT, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({
      emailVerifyToken: token,
      emailVerifyExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    user.isEmailVerified = true
    user.emailVerifyToken = undefined
    user.emailVerifyExpires = undefined
    await user.save()

    // Issue a fresh token with isEmailVerified = true
    const tokenStr = signJWT({ userId: user.id, email: user.email, role: user.role, isEmailVerified: true })
    await setAuthCookie(tokenStr)

    return NextResponse.json({ message: "Email successfully verified" })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}
