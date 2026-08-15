// Re-export all types from the canonical types file in the frontend.
// backend/lib/analyzer.ts and backend/lib/storage.ts import from "./types",
// so this file bridges the gap to the frontend's type definitions.

export type {
  EmotionLabel,
  SentimentLabel,
  RiskLevel,
  EmotionScore,
  SentenceAnalysis,
  PipelineStage,
  PipelineStageResult,
  InsightItem,
  AnalysisResult,
  AssessmentType,
  AssessmentQuestion,
  AssessmentAnswer,
  AssessmentResult,
  HistoryEntry,
  MoodDataPoint,
  PlatformStats,
} from "../../frontend/lib/types";
