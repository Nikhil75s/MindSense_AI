"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, Loader2, Mail, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { user, refreshUser } = useAuth()
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(token ? "loading" : "idle")
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Use a ref to prevent double-firing in strict mode
  const hasAttemptedVerify = useRef(false)

  useEffect(() => {
    if (token && !hasAttemptedVerify.current) {
      hasAttemptedVerify.current = true
      verifyToken(token)
    }
  }, [token])

  const verifyToken = async (verifyTokenStr: string) => {
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verifyTokenStr }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Verification failed")
      }

      setStatus("success")
      await refreshUser()
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/welcome")
      }, 3000)
    } catch (err: unknown) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Failed to verify email")
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError("")
    setResendSuccess(false)

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to resend")
      
      setResendSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend email")
    } finally {
      setIsResending(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Verifying your email...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we confirm your email address.</p>
      </div>
    )
  }

  if (status === "success" || (user && user.isEmailVerified)) {
    return (
      <div className="text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Thank you for verifying your email address. You now have full access to MindSense AI.
        </p>
        <Link href="/welcome">
          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/25">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        
        {user ? (
          <div className="space-y-3">
            <Button onClick={handleResend} disabled={isResending} className="w-full">
              {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Request new link"}
            </Button>
            {resendSuccess && <p className="text-sm text-green-500">New link sent! Check your inbox.</p>}
          </div>
        ) : (
          <Link href="/signin">
            <Button className="w-full">Back to sign in</Button>
          </Link>
        )}
      </div>
    )
  }

  // Idle state (no token in URL, meaning they just landed here after signup)
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
        <Mail className="w-8 h-8 text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold font-display mb-2">Check your email</h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        We&apos;ve sent a verification link to your email address. 
        Please click the link to verify your account.
      </p>
      
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          <p>{error}</p>
        </div>
      )}

      {user ? (
        <div className="space-y-4 pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground">Didn&apos;t receive the email?</p>
          <Button 
            onClick={handleResend} 
            disabled={isResending || resendSuccess} 
            variant={resendSuccess ? "outline" : "default"}
            className={cn("w-full", !resendSuccess && "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0")}
          >
            {isResending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
            ) : resendSuccess ? (
              <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Email sent</>
            ) : (
              "Click to resend"
            )}
          </Button>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground text-center">
              You must verify your email to access the platform.
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-border/40">
          <Link href="/signin">
            <Button variant="outline" className="w-full">Sign in to resend link</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link href="/" className="flex items-center justify-center mb-8 gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold font-display gradient-text">MindSense</span>
          </div>
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl">
          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
