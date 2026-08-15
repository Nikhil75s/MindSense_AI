import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { comparePassword, signJWT, setAuthCookie } from "@/lib/auth"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Return generic error to prevent email enumeration
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60)
      return NextResponse.json(
        { error: `Account locked due to too many failed attempts. Try again in ${minutesLeft} minutes.` },
        { status: 429 }
      )
    }

    const isMatch = await comparePassword(password, user.passwordHash)

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
      }
      await user.save()
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Successful login, reset attempts and update last login
    user.loginAttempts = 0
    user.lockUntil = undefined
    user.lastLogin = new Date()
    await user.save()

    const token = signJWT({ userId: user.id, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified })
    await setAuthCookie(token)

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
