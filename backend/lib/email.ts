import nodemailer from "nodemailer"

// Use environment variables for SMTP, but if they are missing, we will mock the email sending.
// This allows local development to continue smoothly even without an email server.
const SMTP_HOST = process.env.SMTP_HOST || ""
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587")
const SMTP_USER = process.env.SMTP_USER || ""
const SMTP_PASS = process.env.SMTP_PASS || ""
const EMAIL_FROM = process.env.EMAIL_FROM || "MindSense AI <noreply@mindsense.ai>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

let transporter: nodemailer.Transporter | null = null

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

/**
 * Helper to log email content to the console in development
 */
function logEmailToConsole(to: string, subject: string, link: string) {
  console.log("\n" + "=".repeat(60))
  console.log(`📧 EMAIL MOCKED (SMTP not configured)`)
  console.log(`To:      ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`\nLink:\n${link}`)
  console.log("=".repeat(60) + "\n")
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyLink = `${APP_URL}/verify-email?token=${token}`
  const subject = "Verify your email for MindSense AI"
  
  if (!transporter) {
    logEmailToConsole(to, subject, verifyLink)
    return true
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">MindSense AI</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyLink}</p>
          <hr style="border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">If you did not create this account, you can safely ignore this email.</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error("Failed to send verification email:", error)
    return false
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`
  const subject = "Reset your MindSense AI password"
  
  if (!transporter) {
    logEmailToConsole(to, subject, resetLink)
    return true
  }

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">MindSense AI</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">This link will expire in 1 hour.</p>
          <p style="font-size: 12px; color: #64748b; word-break: break-all;">${resetLink}</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    return false
  }
}
