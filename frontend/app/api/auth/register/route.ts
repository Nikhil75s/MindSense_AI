import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { hashPassword, signJWT, setAuthCookie } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, username, newsletter } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    await connectDB()

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 })
    }

    if (username) {
      const existingUsername = await User.findOne({ username })
      if (existingUsername) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 409 })
      }
    }

    const passwordHash = await hashPassword(password)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      username,
      newsletter: !!newsletter,
    })

    // Log the user in immediately
    const token = signJWT({ userId: user.id, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified })
    await setAuthCookie(token)

    return NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
