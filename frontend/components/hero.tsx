"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Zap, ChevronRight, Shield, Globe, BarChart3, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const EMOTION_TAGS = [
  { label: "😔 Depression", color: "#6366f1" },
  { label: "😰 Anxiety", color: "#f59e0b" },
  { label: "😤 Stress", color: "#ef4444" },
  { label: "😊 Happiness", color: "#22c55e" },
  { label: "😠 Anger", color: "#f97316" },
  { label: "😨 Fear", color: "#8b5cf6" },
  { label: "😢 Sadness", color: "#3b82f6" },
  { label: "😐 Neutral", color: "#94a3b8" },
]

const STATS = [
  { label: "Emotions Detected", value: "8+", icon: Sparkles },
  { label: "NLP Pipeline Stages", value: "10", icon: Brain },
  { label: "Data Privacy", value: "End-to-End Secure", icon: Shield },
  { label: "Languages Supported", value: "Multi", icon: Globe },
]

const ANALYSIS_STAGES = [
  "Text Cleaning...",
  "Language Detection...",
  "Tokenization...",
  "Emotion Classification...",
  "Risk Assessment...",
  "Generating Insights...",
]

export default function Hero() {
  const [stageIndex, setStageIndex] = useState(0)
  const [barWidths, setBarWidths] = useState([72, 45, 28, 61, 39, 55, 48])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStageIndex((i) => (i + 1) % ANALYSIS_STAGES.length)
      setBarWidths((prev) => prev.map(() => 20 + Math.random() * 75))
    }, 1800)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.08)_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-md hover:bg-primary/15 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              AI-Powered Mental Health Platform
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.05] tracking-tight">
                Understand Your{" "}
                <span className="gradient-text">Emotional</span>{" "}
                Mind
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Advanced AI-powered sentiment analysis that detects emotions, assesses mental health risk,
                and delivers clinically relevant insights from any text — in seconds.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-xl shadow-indigo-500/30 px-8 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
                >
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Start Analysis
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-8 border-border/60 hover:bg-muted/50 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="w-4 h-4 mr-2 text-muted-foreground" />
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Emotion tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {EMOTION_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: tag.color + "18",
                    borderColor: tag.color + "40",
                    color: tag.color,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Live Analysis Card */}
          <div className="relative animate-fade-in">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl animate-pulse duration-3000" />

            <div className="relative glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <span className="ml-2 text-xs text-white/40 font-mono">MindSense AI Analysis Engine</span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Stage indicator */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                  </div>
                  <span className="text-xs font-mono text-indigo-300 transition-all">
                    {ANALYSIS_STAGES[stageIndex]}
                  </span>
                </div>

                {/* Emotion bars */}
                <div className="space-y-3">
                  {EMOTION_TAGS.map((tag, i) => (
                    <div key={tag.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">{tag.label}</span>
                        <span style={{ color: tag.color }}>{Math.round(barWidths[i])}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${barWidths[i]}%`,
                            backgroundColor: tag.color,
                            boxShadow: `0 0 8px ${tag.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Result card */}
                <div className="rounded-xl p-4 bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Overall Sentiment</p>
                      <p className="text-lg font-bold text-white">Moderate Stress</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Confidence</p>
                      <p className="text-lg font-bold text-indigo-400">87.4%</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-indigo-500/20">
                    <p className="text-xs text-white/50">Risk Level: <span className="text-yellow-400 font-medium">Moderate</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12 border-t border-border/30">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
