"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { id: "text_cleaning", label: "Text Cleaning", description: "Normalizing whitespace, removing special characters" },
  { id: "language_detection", label: "Language Detection", description: "Identifying input language" },
  { id: "tokenization", label: "Tokenization", description: "Breaking text into meaningful tokens" },
  { id: "stopword_removal", label: "Stop Word Removal", description: "Filtering non-informative words" },
  { id: "lemmatization", label: "Lemmatization", description: "Reducing words to root forms" },
  { id: "ner", label: "Named Entity Recognition", description: "Detecting entities and context" },
  { id: "emotion_classification", label: "Emotion Classification", description: "Running ensemble ML models" },
  { id: "sentiment_analysis", label: "Sentiment Analysis", description: "Calculating sentiment polarity" },
  { id: "risk_assessment", label: "Risk Assessment", description: "Evaluating mental health risk level" },
  { id: "confidence_scoring", label: "Confidence Scoring", description: "Computing final confidence scores" },
]

interface Props {
  isVisible: boolean
  onComplete?: () => void
}

export default function ProcessingPipeline({ isVisible, onComplete }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [completedIndices, setCompletedIndices] = useState<number[]>([])

  useEffect(() => {
    if (!isVisible) {
      setActiveIndex(-1)
      setCompletedIndices([])
      return
    }

    let i = 0
    const advance = () => {
      if (i >= STAGES.length) {
        onComplete?.()
        return
      }
      setActiveIndex(i)
      const delay = 180 + Math.random() * 180
      setTimeout(() => {
        setCompletedIndices((prev) => [...prev, i])
        i++
        setTimeout(advance, 60)
      }, delay)
    }

    setTimeout(advance, 200)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-1 animate-scale-in">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        NLP Processing Pipeline
      </p>
      {STAGES.map((stage, idx) => {
        const isDone = completedIndices.includes(idx)
        const isActive = activeIndex === idx && !isDone

        return (
          <div
            key={stage.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-xs",
              isActive && "pipeline-active text-primary",
              isDone && "text-muted-foreground",
              !isActive && !isDone && "text-muted-foreground/40"
            )}
          >
            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : isActive ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className={cn("font-medium", isActive && "text-primary", isDone && "text-foreground")}>
                {stage.label}
              </span>
              {(isActive || isDone) && (
                <span className="text-muted-foreground ml-2">&mdash; {stage.description}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
