import mongoose from "mongoose"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  passwordHash: string
  username?: string
  bio?: string
  avatarUrl?: string
  role: "user" | "admin"
  isEmailVerified: boolean
  emailVerifyToken?: string
  emailVerifyExpires?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  loginAttempts: number
  lockUntil?: Date
  lastLogin?: Date
  newsletter: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    username: { type: String, sparse: true },
    bio: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    emailVerifyExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLogin: { type: Date },
    newsletter: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Export model, check if already exists for hot-reload
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
