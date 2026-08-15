import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
import { getAuthSession } from "@/lib/auth"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate new email verification token
    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    user.emailVerifyToken = verifyToken
    user.emailVerifyExpires = verifyExpires
    await user.save()

    // Send email (async)
    sendVerificationEmail(user.email, user.name, verifyToken).catch(console.error)

    return NextResponse.json({ message: "Verification email sent successfully" })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Failed to resend verification email" }, { status: 500 })
  }
}
