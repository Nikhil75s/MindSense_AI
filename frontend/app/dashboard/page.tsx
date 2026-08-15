"use client"

import { useState, useEffect } from "react"
import { getHistory, getMoodData, getAssessments, clearHistory, deleteHistoryEntry } from "@/lib/storage"
import type { HistoryEntry, MoodDataPoint, AssessmentResult } from "@/lib/types"
import { EMOTION_COLORS, formatDate, getRiskBadgeClass, getSentimentBadgeClass, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts"
import { BarChart3, History, ClipboardList, Search, Trash2, Download, TrendingUp, Brain } from "lucide-react"

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([])
  const [assessments, setAssessments] = useState<AssessmentResult[]>([])
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHistory(getHistory())
    setMoodData(getMoodData())
    setAssessments(getAssessments())
  }, [])

  const filtered = history.filter(
    (h) =>
      h.inputPreview.toLowerCase().includes(search.toLowerCase()) ||
      h.overallEmotion.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id)
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  const handleClearAll = () => {
    clearHistory()
    setHistory([])
    setMoodData([])
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mindsense-history.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Chart data
  const moodChartData = moodData
    .slice(0, 30)
    .reverse()
    .map((d) => ({ date: d.date, score: d.sentimentScore, emotion: d.emotion }))

  const emotionDistData = Object.entries(
    history.reduce<Record<string, number>>((acc, h) => {
      acc[h.overallEmotion] = (acc[h.overallEmotion] ?? 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value, color: EMOTION_COLORS[name as keyof typeof EMOTION_COLORS] ?? "#94a3b8" }))

  const weeklyData = (() => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split("T")[0]
    })
    return last7.map((date) => {
      const entries = moodData.filter((m) => m.date === date)
      const avg = entries.length ? entries.reduce((s, e) => s + e.sentimentScore, 0) / entries.length : null
      return {
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        score: avg !== null ? Math.round(avg) : null,
        count: entries.length,
      }
    })
  })()

  if (!mounted) return null

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="border-b border-border/40 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Track your emotional trends and analysis history
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Analyses", value: history.length, icon: Brain, color: "#6366f1" },
            { label: "Assessments Taken", value: assessments.length, icon: ClipboardList, color: "#22c55e" },
            { label: "Avg Sentiment", value: history.length ? `${Math.round(history.reduce((s, h) => s + h.sentimentScore, 0) / history.length)}` : "—", icon: TrendingUp, color: "#f59e0b" },
            { label: "Top Emotion", value: emotionDistData[0]?.name ?? "—", icon: BarChart3, color: EMOTION_COLORS[emotionDistData[0]?.name as keyof typeof EMOTION_COLORS] ?? "#94a3b8" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border/50 bg-card/50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.color + "20", border: `1px solid ${stat.color}30` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xl font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="trends">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="trends" className="gap-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 text-xs">
              <History className="w-3.5 h-3.5" />
              History
            </TabsTrigger>
            <TabsTrigger value="assessments" className="gap-1.5 text-xs">
              <ClipboardList className="w-3.5 h-3.5" />
              Assessments
            </TabsTrigger>
          </TabsList>

          {/* TRENDS */}
          <TabsContent value="trends" className="mt-5 space-y-5">
            {moodData.length === 0 ? (
              <EmptyState message="No trend data yet. Run analyses to see your mood trends here." />
            ) : (
              <>
                {/* Mood timeline */}
                <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                  <p className="text-sm font-semibold mb-4">Sentiment Timeline</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={moodChartData} margin={{ left: 0, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[-100, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(v: number) => [`${v}`, "Sentiment Score"]}
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Weekly */}
                  <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                    <p className="text-sm font-semibold mb-4">Weekly Mood Report</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={weeklyData} margin={{ left: 0 }}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis domain={[-100, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {weeklyData.map((entry, i) => (
                            <Cell key={i} fill={(entry.score ?? 0) >= 0 ? "#22c55e" : "#ef4444"} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Emotion distribution */}
                  <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                    <p className="text-sm font-semibold mb-4">Emotion Distribution</p>
                    {emotionDistData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={emotionDistData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} strokeWidth={0}>
                            {emotionDistData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : <EmptyState message="No data" />}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* HISTORY */}
          <TabsContent value="history" className="mt-5 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search history…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
              {history.length > 0 && (
                <Button size="sm" variant="ghost" onClick={handleClearAll} className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </Button>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState message={history.length === 0 ? "No analyses saved yet. Run an analysis and click 'Save to History'." : "No results match your search."} />
            ) : (
              <div className="space-y-3">
                {filtered.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-border/40 bg-card/40 p-4 flex items-start gap-4 hover:border-border/60 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg" style={{ background: (EMOTION_COLORS[entry.overallEmotion] ?? "#94a3b8") + "20" }}>
                      {getEmotionEmoji(entry.overallEmotion)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold" style={{ color: EMOTION_COLORS[entry.overallEmotion] }}>
                          {entry.overallEmotion}
                        </span>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getSentimentBadgeClass(entry.overallSentiment))}>
                          {entry.overallSentiment}
                        </span>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getRiskBadgeClass(entry.riskLevel))}>
                          {entry.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{entry.inputPreview}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{formatDate(entry.timestamp)} · {entry.wordCount} words</p>
                    </div>
                    <Button size="icon" variant="ghost" className="w-7 h-7 flex-shrink-0 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ASSESSMENTS */}
          <TabsContent value="assessments" className="mt-5 space-y-3">
            {assessments.length === 0 ? (
              <EmptyState message="No assessments taken yet. Visit the Assessments page to take PHQ-9 or GAD-7 screening tools." />
            ) : (
              assessments.map((a) => (
                <div key={a.id} className="rounded-xl border border-border/40 bg-card/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold font-display uppercase">{a.type === "phq9" ? "PHQ-9 Depression" : "GAD-7 Anxiety"}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(a.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold font-display" style={{ color: a.severityColor }}>
                      {a.totalScore}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: a.severityColor }}>{a.severity}</p>
                      <p className="text-xs text-muted-foreground">{a.nextSteps}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border/40">
      <BarChart3 className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground/60 max-w-xs">{message}</p>
    </div>
  )
}

function getEmotionEmoji(emotion: string): string {
  const map: Record<string, string> = {
    Depression: "😔", Anxiety: "😰", Stress: "😤", Happiness: "😊",
    Anger: "😠", Fear: "😨", Sadness: "😢", Neutral: "😐",
  }
  return map[emotion] ?? "🧠"
}
