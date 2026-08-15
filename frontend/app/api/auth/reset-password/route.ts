import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { hashPassword } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token" },
        { status: 400 }
      )
    }

    // Hash new password and clear reset token
    const passwordHash = await hashPassword(password)
    user.passwordHash = passwordHash
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    
    // Also unlock the account in case they were locked out
    user.loginAttempts = 0
    user.lockUntil = undefined
    
    await user.save()

    return NextResponse.json({ message: "Password has been reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
