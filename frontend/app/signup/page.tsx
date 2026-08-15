"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export default function SignUp() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    newsletter: false,
    terms: false,
  })

  // Password strength check
  const getPasswordStrength = () => {
    const p = formData.password
    let score = 0
    if (!p) return { score: 0, label: "None", color: "bg-muted" }
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++

    if (p.length < 8) return { score: 1, label: "Too short", color: "bg-red-500" }
    if (score <= 2) return { score: 2, label: "Weak", color: "bg-orange-500" }
    if (score === 3) return { score: 3, label: "Good", color: "bg-yellow-500" }
    return { score: 4, label: "Strong", color: "bg-green-500" }
  }

  const strength = getPasswordStrength()
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          newsletter: formData.newsletter,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      await refreshUser()
      
      // Redirect to dashboard immediately after registration
      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in my-8">
        <Link href="/" className="flex items-center justify-center mb-8 gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold font-display gradient-text">MindSense</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">AI Platform</span>
          </div>
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-display mb-2">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Join MindSense AI to track your emotional wellbeing
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-background/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {formData.password && (
                <div className="pt-1">
                  <div className="flex gap-1 h-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-full transition-colors",
                          i <= Math.max(1, strength.score) ? strength.color : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground flex justify-between">
                    <span>{strength.label}</span>
                    <span>Min 8 characters</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={cn("bg-background/50", formData.confirmPassword && !passwordsMatch && "border-red-500/50")}
                />
                {passwordsMatch && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex items-start space-x-2.5">
                <Checkbox 
                  id="terms" 
                  required 
                  checked={formData.terms}
                  onCheckedChange={(c) => setFormData({ ...formData, terms: !!c })}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-xs font-normal leading-relaxed text-muted-foreground cursor-pointer">
                  I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. *
                </Label>
              </div>
              <div className="flex items-start space-x-2.5">
                <Checkbox 
                  id="newsletter" 
                  checked={formData.newsletter}
                  onCheckedChange={(c) => setFormData({ ...formData, newsletter: !!c })}
                  className="mt-0.5"
                />
                <Label htmlFor="newsletter" className="text-xs font-normal text-muted-foreground cursor-pointer">
                  Send me mental wellness tips and product updates.
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/25 h-11 mt-4" 
              disabled={isLoading || !formData.terms}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
              ) : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
