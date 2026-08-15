"use client"

import { useEffect, useState } from "react"
import { getHistory, getAssessments } from "@/lib/storage"
import type { HistoryEntry, AssessmentResult } from "@/lib/types"
import { EMOTION_COLORS, formatDate, getRiskBadgeClass, cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Users, Brain, ClipboardList, MessageSquare, Activity, CheckCircle2, AlertTriangle } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function AdminPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [assessments, setAssessments] = useState<AssessmentResult[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHistory(getHistory())
    setAssessments(getAssessments())
  }, [])

  if (!mounted) return null

  const emotionDist = Object.entries(
    history.reduce<Record<string, number>>((acc, h) => {
      acc[h.overallEmotion] = (acc[h.overallEmotion] ?? 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value, color: EMOTION_COLORS[name as keyof typeof EMOTION_COLORS] ?? "#94a3b8" }))

  const riskDist = Object.entries(
    history.reduce<Record<string, number>>((acc, h) => {
      acc[h.riskLevel] = (acc[h.riskLevel] ?? 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({
    name,
    value,
    color: name === "Low" ? "#22c55e" : name === "Moderate" ? "#f59e0b" : name === "High" ? "#f97316" : "#ef4444",
  }))

  const highRiskEntries = history.filter((h) => h.riskLevel === "High" || h.riskLevel === "Critical")

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="border-b border-border/40 bg-gradient-to-r from-slate-500/5 to-gray-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Platform analytics, system monitoring, and management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Analyses", value: history.length, icon: Brain, color: "#6366f1" },
            { label: "Total Assessments", value: assessments.length, icon: ClipboardList, color: "#22c55e" },
            { label: "High Risk Alerts", value: highRiskEntries.length, icon: AlertTriangle, color: "#ef4444" },
            { label: "Unique Sessions", value: history.length, icon: Users, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-card/50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "20", border: `1px solid ${s.color}30` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="analytics">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">AI Logs</TabsTrigger>
            <TabsTrigger value="surveys" className="text-xs">Surveys</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
          </TabsList>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="mt-5 space-y-5">
            {history.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-border/40">
                <Activity className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground/60">No analysis data yet.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                  <p className="text-sm font-semibold mb-4">Emotion Distribution</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={emotionDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                        {emotionDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emotionDist.map((e) => (
                      <div key={e.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                        <span className="text-muted-foreground">{e.name} ({e.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                  <p className="text-sm font-semibold mb-4">Risk Level Distribution</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={riskDist} margin={{ left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {riskDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* High Risk Alerts */}
            {highRiskEntries.length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <p className="text-sm font-semibold text-red-400">High Risk Analyses</p>
                </div>
                <div className="space-y-2">
                  {highRiskEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 text-xs">
                      <span className={cn("px-2 py-0.5 rounded-full font-medium border flex-shrink-0", getRiskBadgeClass(entry.riskLevel))}>
                        {entry.riskLevel}
                      </span>
                      <span className="text-muted-foreground line-clamp-1 flex-1">{entry.inputPreview}</span>
                      <span className="text-muted-foreground/50 flex-shrink-0">{formatDate(entry.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI LOGS */}
          <TabsContent value="logs" className="mt-5">
            <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
              <div className="p-4 border-b border-border/40">
                <p className="text-sm font-semibold">Analysis Logs</p>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="py-12 text-center"><p className="text-sm text-muted-foreground/60">No logs yet.</p></div>
                ) : (
                  history.map((h, i) => (
                    <div key={h.id} className={cn("flex items-start gap-4 p-4 text-xs border-b border-border/20 last:border-0 hover:bg-muted/10")}>
                      <span className="text-muted-foreground/40 tabular-nums w-6 flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-medium" style={{ color: EMOTION_COLORS[h.overallEmotion] }}>{h.overallEmotion}</span>
                          <span className={cn("px-1.5 py-0 rounded-full text-[10px] border", getRiskBadgeClass(h.riskLevel))}>{h.riskLevel}</span>
                          <span className="text-muted-foreground/50">{h.wordCount}w</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-1">{h.inputPreview}</p>
                      </div>
                      <span className="text-muted-foreground/40 flex-shrink-0 whitespace-nowrap">{formatDate(h.timestamp)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* SURVEYS */}
          <TabsContent value="surveys" className="mt-5">
            <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
              <div className="p-4 border-b border-border/40">
                <p className="text-sm font-semibold">Survey Results ({assessments.length})</p>
              </div>
              {assessments.length === 0 ? (
                <div className="py-12 text-center"><p className="text-sm text-muted-foreground/60">No survey results yet.</p></div>
              ) : (
                assessments.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 border-b border-border/20 last:border-0 text-sm hover:bg-muted/10">
                    <span className="font-bold uppercase text-xs">{a.type}</span>
                    <span className="text-xl font-bold font-display" style={{ color: a.severityColor }}>{a.totalScore}</span>
                    <span style={{ color: a.severityColor }} className="text-xs font-medium">{a.severity}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{formatDate(a.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* SYSTEM */}
          <TabsContent value="system" className="mt-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "NLP Engine", status: "Operational", color: "#22c55e" },
                { label: "Storage (localStorage)", status: "Operational", color: "#22c55e" },
                { label: "API Routes", status: "Operational", color: "#22c55e" },
                { label: "ML Ensemble", status: "Simulated", color: "#f59e0b" },
                { label: "Python ML Service", status: "Requires Docker", color: "#f97316" },
                { label: "URL Extractor", status: "Operational", color: "#22c55e" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-card/40">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs" style={{ color: s.color }}>{s.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-5 rounded-2xl border border-border/50 bg-card/50">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Platform Info
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Framework: Next.js 15</span>
                <span>Language: TypeScript</span>
                <span>Styling: Tailwind CSS</span>
                <span>Charts: Recharts</span>
                <span>ML Engine: MindSense NLP v2.4.1</span>
                <span>Storage: localStorage (client-side)</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
