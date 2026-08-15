"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, ArrowRight, Sparkles, User, Zap, BarChart3 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import confetti from "canvas-confetti"

export default function Welcome() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Fire confetti when page loads
    if (user) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        )
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        )
      }, 250)

      return () => clearInterval(interval)
    }
  }, [user, loading, router])

  if (!mounted || loading || !user) return null

  const firstName = user.name.split(" ")[0]

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[120px]" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-in text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 mx-auto mb-8">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
          Welcome to <span className="gradient-text">MindSense AI</span>, {firstName}!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          Your account is set up and ready to go. Start tracking your emotional wellness with our advanced AI tools today.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <Link href="/analyze" className="block group">
            <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all hover:bg-card/80 hover:border-primary/30 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold font-display mb-1">Analyze</h3>
              <p className="text-xs text-muted-foreground">Try the AI sentiment analyzer</p>
            </div>
          </Link>
          
          <Link href="/dashboard" className="block group">
            <div className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-6 transition-all hover:bg-primary/10 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="font-bold font-display mb-1 text-primary">Dashboard</h3>
              <p className="text-xs text-muted-foreground">View your emotional history</p>
            </div>
          </Link>

          <Link href="/profile" className="block group">
            <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all hover:bg-card/80 hover:border-primary/30 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold font-display mb-1">Profile</h3>
              <p className="text-xs text-muted-foreground">Complete your account setup</p>
            </div>
          </Link>
        </div>

        <Link href="/dashboard">
          <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/25 px-8">
            Go to my Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
