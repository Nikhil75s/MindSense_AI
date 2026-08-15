import type {
  AnalysisResult,
  AssessmentResult,
  HistoryEntry,
  MoodDataPoint,
} from "./types";

const KEYS = {
  history: "mindsense_history",
  assessments: "mindsense_assessments",
  moodData: "mindsense_mood_data",
} as const;

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

// ─── Analysis History ──────────────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
  return safeGet<HistoryEntry[]>(KEYS.history, []);
}

export function saveAnalysis(result: AnalysisResult): void {
  const history = getHistory();
  const entry: HistoryEntry = {
    id: result.id,
    timestamp: result.timestamp,
    inputPreview: result.inputText.slice(0, 120) + (result.inputText.length > 120 ? "…" : ""),
    wordCount: result.wordCount,
    overallEmotion: result.overallEmotion,
    overallSentiment: result.overallSentiment,
    riskLevel: result.riskLevel,
    sentimentScore: result.sentimentScore,
    emotionScores: result.emotionScores,
  };

  const updated = [entry, ...history].slice(0, 100); // keep last 100
  safeSet(KEYS.history, updated);

  // Also update mood timeline
  const moodData = getMoodData();
  const point: MoodDataPoint = {
    date: result.timestamp.split("T")[0],
    sentimentScore: result.sentimentScore,
    emotion: result.overallEmotion,
    riskLevel: result.riskLevel,
  };
  safeSet(KEYS.moodData, [point, ...moodData].slice(0, 90));
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  safeSet(KEYS.history, history);
}

export function clearHistory(): void {
  safeSet(KEYS.history, []);
}

// ─── Assessments ────────────────────────────────────────────────────────────

export function getAssessments(): AssessmentResult[] {
  return safeGet<AssessmentResult[]>(KEYS.assessments, []);
}

export function saveAssessment(result: AssessmentResult): void {
  const assessments = getAssessments();
  const updated = [result, ...assessments].slice(0, 50);
  safeSet(KEYS.assessments, updated);
}

export function clearAssessments(): void {
  safeSet(KEYS.assessments, []);
}

// ─── Mood Timeline ──────────────────────────────────────────────────────────

export function getMoodData(): MoodDataPoint[] {
  return safeGet<MoodDataPoint[]>(KEYS.moodData, []);
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export function getPlatformStats() {
  const history = getHistory();
  const assessments = getAssessments();

  if (history.length === 0) {
    return null;
  }

  const avgSentiment =
    history.reduce((sum, h) => sum + h.sentimentScore, 0) / history.length;

  const emotionCounts: Record<string, number> = {};
  const riskCounts: Record<string, number> = { Low: 0, Moderate: 0, High: 0, Critical: 0 };

  for (const entry of history) {
    emotionCounts[entry.overallEmotion] = (emotionCounts[entry.overallEmotion] ?? 0) + 1;
    riskCounts[entry.riskLevel] = (riskCounts[entry.riskLevel] ?? 0) + 1;
  }

  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Neutral";

  return {
    totalAnalyses: history.length,
    totalAssessments: assessments.length,
    avgSentimentScore: Math.round(avgSentiment),
    topEmotion,
    riskDistribution: riskCounts,
    emotionDistribution: emotionCounts,
  };
}
