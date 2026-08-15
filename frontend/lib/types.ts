// ─── Emotion & Sentiment Types ───────────────────────────────────────────────

export type EmotionLabel =
  | "Depression"
  | "Anxiety"
  | "Stress"
  | "Happiness"
  | "Anger"
  | "Fear"
  | "Sadness"
  | "Neutral";

export type SentimentLabel = "Positive" | "Negative" | "Neutral";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export interface EmotionScore {
  emotion: EmotionLabel;
  score: number; // 0–100
  confidence: number; // 0–1
  color: string;
  bgColor: string;
}

export interface SentenceAnalysis {
  text: string;
  emotion: EmotionLabel;
  sentiment: SentimentLabel;
  confidence: number; // 0–1
  riskLevel: RiskLevel;
  scores: EmotionScore[];
}

// ─── NLP Pipeline Types ────────────────────────────────────────────────────

export type PipelineStage =
  | "text_cleaning"
  | "language_detection"
  | "tokenization"
  | "stopword_removal"
  | "lemmatization"
  | "ner"
  | "emotion_classification"
  | "sentiment_analysis"
  | "risk_assessment"
  | "confidence_scoring";

export interface PipelineStageResult {
  stage: PipelineStage;
  label: string;
  description: string;
  status: "pending" | "processing" | "done";
  duration?: number; // ms
  output?: string;
}

// ─── Analysis Result ────────────────────────────────────────────────────────

export interface InsightItem {
  type: "warning" | "info" | "success" | "critical";
  category: string;
  message: string;
  recommendation?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  inputText: string;
  wordCount: number;
  sentenceCount: number;
  language: string;
  overallEmotion: EmotionLabel;
  overallSentiment: SentimentLabel;
  overallConfidence: number;
  riskLevel: RiskLevel;
  sentimentScore: number; // -100 to +100
  emotionScores: EmotionScore[];
  sentences: SentenceAnalysis[];
  insights: InsightItem[];
  recommendedAssessments: string[];
  processingTimeMs: number;
  modelInfo: {
    name: string;
    version: string;
    ensemble: string[];
  };
}

// ─── Clinical Assessment Types ─────────────────────────────────────────────

export type AssessmentType = "phq9" | "gad7";

export interface AssessmentQuestion {
  id: number;
  text: string;
}

export interface AssessmentAnswer {
  questionId: number;
  value: number; // 0–3
  label: string;
}

export interface AssessmentResult {
  id: string;
  type: AssessmentType;
  timestamp: string;
  answers: AssessmentAnswer[];
  totalScore: number;
  severity: string;
  severityColor: string;
  recommendations: string[];
  nextSteps: string;
}

// ─── History & Storage ─────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  timestamp: string;
  inputPreview: string; // first 100 chars
  wordCount: number;
  overallEmotion: EmotionLabel;
  overallSentiment: SentimentLabel;
  riskLevel: RiskLevel;
  sentimentScore: number;
  emotionScores: EmotionScore[];
}

export interface MoodDataPoint {
  date: string;
  sentimentScore: number;
  emotion: EmotionLabel;
  riskLevel: RiskLevel;
}

// ─── Admin / Analytics Types ───────────────────────────────────────────────

export interface PlatformStats {
  totalAnalyses: number;
  totalAssessments: number;
  avgSentimentScore: number;
  topEmotion: EmotionLabel;
  riskDistribution: Record<RiskLevel, number>;
  emotionDistribution: Record<EmotionLabel, number>;
}
