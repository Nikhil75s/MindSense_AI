import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EmotionLabel, RiskLevel, SentimentLabel } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskBadgeClass(risk: RiskLevel): string {
  return {
    Low: "bg-green-500/15 text-green-400 border-green-500/30",
    Moderate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    High: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    Critical: "bg-red-500/15 text-red-400 border-red-500/30",
  }[risk]
}

export function getSentimentBadgeClass(sentiment: SentimentLabel): string {
  return {
    Positive: "bg-green-500/15 text-green-400 border-green-500/30",
    Negative: "bg-red-500/15 text-red-400 border-red-500/30",
    Neutral: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  }[sentiment]
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text
}

export const EMOTION_COLORS: Record<EmotionLabel, string> = {
  Depression: "#6366f1",
  Anxiety: "#f59e0b",
  Stress: "#ef4444",
  Happiness: "#22c55e",
  Anger: "#f97316",
  Fear: "#8b5cf6",
  Sadness: "#3b82f6",
  Neutral: "#94a3b8",
}
