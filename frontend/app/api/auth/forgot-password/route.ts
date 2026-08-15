import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })
    
    // We always return a success message even if the user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      // Small delay to simulate processing to prevent timing attacks
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ message: "If that email is registered, a password reset link has been sent." })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetExpires
    await user.save()

    // Send email (async)
    sendPasswordResetEmail(user.email, user.name, resetToken).catch(console.error)

    return NextResponse.json({ message: "If that email is registered, a password reset link has been sent." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
