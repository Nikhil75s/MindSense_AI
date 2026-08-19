import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { hashPassword, setAuthCookie, signJWT } from "@/lib/auth"

const STATE_COOKIE = "google_oauth_state"

export async function GET(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error")
  const code = req.nextUrl.searchParams.get("code")
  const state = req.nextUrl.searchParams.get("state")
  const savedState = req.cookies.get(STATE_COOKIE)?.value

  if (error || !code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL("/signin?error=google_auth_failed", req.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.nextUrl.origin}/api/auth/google/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/signin?error=google_not_configured", req.url))
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })
    const tokens = await tokenResponse.json()
    if (!tokenResponse.ok || !tokens.access_token) throw new Error("Google token exchange failed")

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileResponse.json()
    if (!profileResponse.ok || !profile.email || !profile.email_verified) {
      throw new Error("Google profile did not contain a verified email")
    }

    await connectDB()
    const email = String(profile.email).toLowerCase()
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name: profile.name || email.split("@")[0],
        email,
        passwordHash: await hashPassword(`google:${profile.sub}:${crypto.randomUUID()}`),
        avatarUrl: profile.picture,
        isEmailVerified: true,
      })
    } else if (profile.picture && !user.avatarUrl) {
      user.avatarUrl = profile.picture
      user.isEmailVerified = true
      await user.save()
    }

    const token = signJWT({ userId: user.id, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified })
    const response = NextResponse.redirect(new URL("/dashboard", req.url))
    response.cookies.set(STATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
    await setAuthCookie(token)
    return response
  } catch (callbackError) {
    console.error("Google OAuth error:", callbackError)
    return NextResponse.redirect(new URL("/signin?error=google_auth_failed", req.url))
  }
}