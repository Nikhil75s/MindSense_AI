"use client"

import type { AnalysisResult } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, Download, Clock, Hash } from "lucide-react"
import { EMOTION_COLORS, formatDate, getRiskBadgeClass, getSentimentBadgeClass, cn } from "@/lib/utils"

interface Props {
  result: AnalysisResult
  onSave: () => void
  onReset: () => void
  isSaved: boolean
}

export default function ResultsSummary({ result, onSave, onReset, isSaved }: Props) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mindsense-analysis-${result.id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4 animate-scale-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-xl font-bold font-display"
              style={{ color: EMOTION_COLORS[result.overallEmotion] }}
            >
              {result.overallEmotion}
            </h3>
            <span
              className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getSentimentBadgeClass(result.overallSentiment))}
            >
              {result.overallSentiment}
            </span>
            <span
              className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium border", getRiskBadgeClass(result.riskLevel))}
            >
              {result.riskLevel} Risk
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(result.timestamp)}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {result.wordCount} words · {result.sentenceCount} sentences
            </span>
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold font-display text-primary">
            {Math.round(result.overallConfidence * 100)}%
          </p>
          <p className="text-[10px] text-muted-foreground">Confidence</p>
        </div>
      </div>

      {/* Model info */}
      <div className="text-xs text-muted-foreground/60 flex flex-wrap gap-x-3 gap-y-0.5 pt-2 border-t border-border/30">
        <span>Model: {result.modelInfo.name}</span>
        <span>Ensemble: {result.modelInfo.ensemble.join(", ")}</span>
        <span>Language: {result.language}</span>
        <span>Processed in {result.processingTimeMs}ms</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          id="save-analysis-btn"
          size="sm"
          onClick={onSave}
          disabled={isSaved}
          className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaved ? "Saved to History" : "Save to History"}
        </Button>
        <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export JSON
        </Button>
        <Button size="sm" variant="ghost" onClick={onReset} className="gap-1.5 ml-auto">
          <RotateCcw className="w-3.5 h-3.5" />
          New Analysis
        </Button>
      </div>
    </div>
  )
}
