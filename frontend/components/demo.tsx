"use client"

import { useState, useCallback } from "react"
import type { AnalysisResult } from "@/lib/types"
import { saveAnalysis } from "@/lib/storage"
import InputPanel from "@/components/analysis/InputPanel"
import ProcessingPipeline from "@/components/analysis/ProcessingPipeline"
import EmotionDashboard from "@/components/analysis/EmotionDashboard"
import InsightsPanel from "@/components/analysis/InsightsPanel"
import ResultsSummary from "@/components/analysis/ResultsSummary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Lightbulb, AlertCircle, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Phase = "idle" | "processing" | "results"

export default function Demo() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  const handleAnalyze = useCallback(async (text: string, source?: string) => {
    setPhase("processing")
    setError("")
    setResult(null)
    setIsSaved(false)

    try {
      let apiResult: AnalysisResult
      if (text === "__URL__" && source) {
        const res = await fetch("/api/analyze/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: source }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? "URL analysis failed")
        apiResult = data
      } else {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? "Analysis failed")
        apiResult = data
      }
      setResult(apiResult)
      setPhase("results")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed.")
      setPhase("idle")
    }
  }, [])

  const handleSave = () => {
    if (result && !isSaved) {
      saveAnalysis(result)
      setIsSaved(true)
    }
  }

  const handleReset = () => {
    setPhase("idle")
    setResult(null)
    setError("")
    setIsSaved(false)
  }

  return (
    <section id="demo" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Live Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Try the{" "}
            <span className="gradient-text">AI Analysis</span>{" "}
            Now
          </h2>
          <p className="text-lg text-muted-foreground">
            Enter text, upload a file, or provide a URL. Our NLP engine analyzes emotions in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {/* Input */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
              <InputPanel onAnalyze={handleAnalyze} isLoading={phase === "processing"} />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <ProcessingPipeline isVisible={phase === "processing"} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {phase === "idle" && !result && (
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center rounded-2xl border border-dashed border-border/40 bg-card/20 p-12">
                <Zap className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <p className="text-sm text-muted-foreground/60 max-w-xs">
                  Results will appear here after analysis. Use the input panel on the left.
                </p>
              </div>
            )}
            {phase === "processing" && (
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-12">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30">
                  <BarChart3 className="w-7 h-7 text-white animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground/70">Processing your text…</p>
              </div>
            )}
            {phase === "results" && result && (
              <div className="space-y-5 animate-slide-up">
                <ResultsSummary result={result} onSave={handleSave} onReset={handleReset} isSaved={isSaved} />
                <Tabs defaultValue="dashboard">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="dashboard" className="gap-1.5 text-xs">
                      <BarChart3 className="w-3.5 h-3.5" /> Emotion Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="gap-1.5 text-xs">
                      <Lightbulb className="w-3.5 h-3.5" /> Insights
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="dashboard" className="mt-4">
                    <EmotionDashboard result={result} />
                  </TabsContent>
                  <TabsContent value="insights" className="mt-4">
                    <InsightsPanel insights={result.insights} recommendedAssessments={result.recommendedAssessments} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>

        {/* CTA to full studio */}
        <div className="text-center mt-12 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground mb-3">
            Want sentence-level breakdown and full history tracking?
          </p>
          <Link href="/analyze">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/25">
              <Zap className="w-4 h-4 mr-2" />
              Open Full Analysis Studio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
