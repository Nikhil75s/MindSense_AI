"use client"

import type { AnalysisResult } from "@/lib/types"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts"
import { EMOTION_COLORS } from "@/lib/utils"

interface Props {
  result: AnalysisResult
}

export default function EmotionDashboard({ result }: Props) {
  const radarData = result.emotionScores.map((e) => ({
    subject: e.emotion.slice(0, 4),
    value: e.score,
    fullMark: 100,
  }))

  const barData = [...result.emotionScores]
    .sort((a, b) => b.score - a.score)
    .map((e) => ({
      name: e.emotion,
      score: e.score,
      confidence: Math.round(e.confidence * 100),
      color: e.color,
    }))

  const sentimentColor =
    result.sentimentScore > 20 ? "#22c55e" : result.sentimentScore < -20 ? "#ef4444" : "#94a3b8"

  return (
    <div className="space-y-5">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Dominant Emotion"
          value={result.overallEmotion}
          sub={`${Math.round(result.overallConfidence * 100)}% confident`}
          color={EMOTION_COLORS[result.overallEmotion]}
        />
        <MetricCard
          label="Sentiment Score"
          value={result.sentimentScore > 0 ? `+${result.sentimentScore}` : String(result.sentimentScore)}
          sub={result.overallSentiment}
          color={sentimentColor}
        />
        <MetricCard
          label="Risk Level"
          value={result.riskLevel}
          sub={`${result.wordCount} words analyzed`}
          color={
            result.riskLevel === "Low" ? "#22c55e"
              : result.riskLevel === "Moderate" ? "#f59e0b"
              : result.riskLevel === "High" ? "#f97316"
              : "#ef4444"
          }
        />
        <MetricCard
          label="Language"
          value={result.language}
          sub={`${result.sentenceCount} sentences`}
          color="#6366f1"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Emotion Radar
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              />
              <Radar
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Emotion Scores
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 8 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={70} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Score"]}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confidence bars */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Confidence Distribution
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {result.emotionScores.map((e) => (
            <div key={e.emotion} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{e.emotion}</span>
                <span className="font-medium" style={{ color: e.color }}>
                  {e.score}% · {Math.round(e.confidence * 100)}% conf.
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${e.score}%`, backgroundColor: e.color, boxShadow: `0 0 6px ${e.color}60` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-bold font-display" style={{ color }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  )
}
