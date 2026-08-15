"use client"

import { useState, useCallback } from "react"
import type { AnalysisResult } from "@/lib/types"
import { saveAnalysis } from "@/lib/storage"
import InputPanel from "@/components/analysis/InputPanel"
import ProcessingPipeline from "@/components/analysis/ProcessingPipeline"
import EmotionDashboard from "@/components/analysis/EmotionDashboard"
import SentenceBreakdown from "@/components/analysis/SentenceBreakdown"
import InsightsPanel from "@/components/analysis/InsightsPanel"
import ResultsSummary from "@/components/analysis/ResultsSummary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, BarChart3, MessageSquare, Lightbulb, AlertCircle } from "lucide-react"

type Phase = "idle" | "processing" | "results"

export default function AnalyzePage() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [isPipelineDone, setIsPipelineDone] = useState(false)

  const handleAnalyze = useCallback(async (text: string, source?: string) => {
    setPhase("processing")
    setError("")
    setResult(null)
    setIsSaved(false)
    setIsPipelineDone(false)

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
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
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
    setIsPipelineDone(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero strip */}
      <div className="border-b border-border/40 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">AI Analysis Studio</h1>
              <p className="text-sm text-muted-foreground">
                Multi-modal text analysis with NLP pipeline, emotion classification, and clinical insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left — Input + Pipeline */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
              <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                Input Source
              </h2>
              <InputPanel onAnalyze={handleAnalyze} isLoading={phase === "processing"} />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <ProcessingPipeline
              isVisible={phase === "processing"}
              onComplete={() => setIsPipelineDone(true)}
            />
          </div>

          {/* Right — Results */}
          <div className="lg:col-span-3">
            {phase === "idle" && !result && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center rounded-2xl border border-dashed border-border/40 bg-card/20 p-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-indigo-400/60" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2 text-muted-foreground">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground/60 max-w-xs">
                  Enter text, upload a file, or provide a URL on the left panel, then click &ldquo;Run AI Analysis&rdquo;.
                </p>
              </div>
            )}

            {phase === "processing" && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-lg font-bold font-display mb-2">Analyzing Your Text</h3>
                <p className="text-sm text-muted-foreground/70 max-w-xs">
                  Running NLP pipeline across {isPipelineDone ? "all" : "multiple"} stages…
                </p>
              </div>
            )}

            {phase === "results" && result && (
              <div className="space-y-5 animate-slide-up">
                <ResultsSummary
                  result={result}
                  onSave={handleSave}
                  onReset={handleReset}
                  isSaved={isSaved}
                />

                <Tabs defaultValue="dashboard">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="dashboard" className="gap-1.5 text-xs">
                      <BarChart3 className="w-3.5 h-3.5" />
                      Emotion Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="sentences" className="gap-1.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Sentences ({result.sentences.length})
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="gap-1.5 text-xs">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Insights
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dashboard" className="mt-4">
                    <EmotionDashboard result={result} />
                  </TabsContent>

                  <TabsContent value="sentences" className="mt-4">
                    <SentenceBreakdown sentences={result.sentences} />
                  </TabsContent>

                  <TabsContent value="insights" className="mt-4">
                    <InsightsPanel
                      insights={result.insights}
                      recommendedAssessments={result.recommendedAssessments}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
