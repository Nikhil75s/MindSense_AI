"use client"

import type { SentenceAnalysis } from "@/lib/types"
import { getRiskBadgeClass, getSentimentBadgeClass } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface Props {
  sentences: SentenceAnalysis[]
}

const EMOTION_EMOJI: Record<string, string> = {
  Depression: "😔",
  Anxiety: "😰",
  Stress: "😤",
  Happiness: "😊",
  Anger: "😠",
  Fear: "😨",
  Sadness: "😢",
  Neutral: "😐",
}

export default function SentenceBreakdown({ sentences }: Props) {
  if (!sentences.length) return null

  const highRiskSentences = sentences.filter(
    (s) => s.riskLevel === "High" || s.riskLevel === "Critical"
  )

  return (
    <div className="space-y-4">
      {/* Risk alert */}
      {highRiskSentences.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-400">
              {highRiskSentences.length} sentence{highRiskSentences.length > 1 ? "s" : ""} flagged as high risk
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              These sentences contain language associated with significant emotional distress.
            </p>
          </div>
        </div>
      )}

      {/* Sentence cards */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {sentences.map((sentence, idx) => {
          const isHighRisk = sentence.riskLevel === "High" || sentence.riskLevel === "Critical"
          return (
            <div
              key={idx}
              className={cn(
                "rounded-xl border p-4 transition-all",
                isHighRisk
                  ? "border-orange-500/30 bg-orange-500/5"
                  : "border-border/40 bg-card/40 hover:border-border/60"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{EMOTION_EMOJI[sentence.emotion]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed mb-3">{sentence.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      label={sentence.emotion}
                      style={{
                        backgroundColor: getEmotionColor(sentence.emotion) + "20",
                        color: getEmotionColor(sentence.emotion),
                        borderColor: getEmotionColor(sentence.emotion) + "40",
                      }}
                    />
                    <Badge
                      label={sentence.sentiment}
                      className={getSentimentBadgeClass(sentence.sentiment)}
                    />
                    <Badge
                      label={sentence.riskLevel + " Risk"}
                      className={getRiskBadgeClass(sentence.riskLevel)}
                    />
                    <Badge
                      label={`${Math.round(sentence.confidence * 100)}% conf.`}
                      className="bg-muted text-muted-foreground border-border/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Badge({
  label,
  className,
  style,
}: {
  label: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", className)}
      style={style}
    >
      {label}
    </span>
  )
}

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    Depression: "#6366f1",
    Anxiety: "#f59e0b",
    Stress: "#ef4444",
    Happiness: "#22c55e",
    Anger: "#f97316",
    Fear: "#8b5cf6",
    Sadness: "#3b82f6",
    Neutral: "#94a3b8",
  }
  return colors[emotion] ?? "#94a3b8"
}
