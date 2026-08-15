"use client"

import { useState, useEffect } from "react"
import { saveAssessment, getAssessments } from "@/lib/storage"
import type { AssessmentAnswer, AssessmentResult } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, ClipboardList, History, RotateCcw } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

const PHQ9 = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or feeling like a failure",
  "Trouble concentrating on things, such as reading or watching TV",
  "Moving or speaking so slowly others may have noticed — or being so fidgety you moved more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself",
]

const GAD7 = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
]

const OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

function interpretPHQ9(score: number): { severity: string; color: string; nextSteps: string; recs: string[] } {
  if (score <= 4) return { severity: "Minimal depression", color: "#22c55e", nextSteps: "Your score indicates minimal symptoms. Continue monitoring your mental wellness.", recs: ["Practice daily mindfulness", "Maintain social connections", "Regular physical exercise"] }
  if (score <= 9) return { severity: "Mild depression", color: "#f59e0b", nextSteps: "Mild symptoms detected. Consider discussing with a healthcare provider.", recs: ["Consider talking to a counselor", "Establish a consistent sleep routine", "Increase physical activity"] }
  if (score <= 14) return { severity: "Moderate depression", color: "#f97316", nextSteps: "Moderate symptoms. A healthcare professional consultation is recommended.", recs: ["Schedule an appointment with a mental health professional", "Consider therapy (CBT is highly effective)", "Build a support network"] }
  if (score <= 19) return { severity: "Moderately severe depression", color: "#ef4444", nextSteps: "Significant symptoms detected. Please seek professional support promptly.", recs: ["Contact a mental health professional immediately", "Inform a trusted friend or family member", "Consider crisis resources if needed"] }
  return { severity: "Severe depression", color: "#dc2626", nextSteps: "Severe symptoms detected. Please seek professional help immediately.", recs: ["Contact a mental health crisis line", "Visit an emergency mental health service", "Do not face this alone — reach out now"] }
}

function interpretGAD7(score: number): { severity: string; color: string; nextSteps: string; recs: string[] } {
  if (score <= 4) return { severity: "Minimal anxiety", color: "#22c55e", nextSteps: "Minimal anxiety symptoms. Keep monitoring and practicing self-care.", recs: ["Practice relaxation techniques", "Limit caffeine intake", "Maintain regular exercise"] }
  if (score <= 9) return { severity: "Mild anxiety", color: "#f59e0b", nextSteps: "Mild anxiety detected. Self-care strategies may help.", recs: ["Try deep breathing exercises", "Practice mindfulness or meditation", "Consider journaling your worries"] }
  if (score <= 14) return { severity: "Moderate anxiety", color: "#f97316", nextSteps: "Moderate anxiety. Professional consultation is recommended.", recs: ["Consult with a mental health professional", "Explore Cognitive Behavioral Therapy (CBT)", "Consider an anxiety management course"] }
  return { severity: "Severe anxiety", color: "#ef4444", nextSteps: "Significant anxiety detected. Please consult a healthcare professional.", recs: ["Seek professional mental health support", "Discuss possible treatment options with your doctor", "Build a daily relaxation routine"] }
}

type AssessmentType = "phq9" | "gad7"

interface AssessmentState {
  answers: Record<number, number>
  result: AssessmentResult | null
  currentQuestion: number
}

function useAssessment(type: AssessmentType, questions: string[]) {
  const [state, setState] = useState<AssessmentState>({ answers: {}, result: null, currentQuestion: 0 })

  const setAnswer = (idx: number, value: number) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [idx]: value } }))
  }

  const next = () => setState((s) => ({ ...s, currentQuestion: Math.min(s.currentQuestion + 1, questions.length - 1) }))
  const prev = () => setState((s) => ({ ...s, currentQuestion: Math.max(s.currentQuestion - 1, 0) }))

  const submit = () => {
    const total = Object.values(state.answers).reduce((sum, v) => sum + v, 0)
    const interp = type === "phq9" ? interpretPHQ9(total) : interpretGAD7(total)
    const result: AssessmentResult = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      answers: Object.entries(state.answers).map(([k, v]) => ({
        questionId: Number(k),
        value: v,
        label: OPTIONS.find((o) => o.value === v)?.label ?? "",
      })),
      totalScore: total,
      severity: interp.severity,
      severityColor: interp.color,
      recommendations: interp.recs,
      nextSteps: interp.nextSteps,
    }
    saveAssessment(result)
    setState((s) => ({ ...s, result }))
  }

  const reset = () => setState({ answers: {}, result: null, currentQuestion: 0 })

  const isComplete = Object.keys(state.answers).length === questions.length
  const progress = Math.round((Object.keys(state.answers).length / questions.length) * 100)

  return { state, setAnswer, next, prev, submit, reset, isComplete, progress }
}

export default function AssessmentsPage() {
  const [savedAssessments, setSavedAssessments] = useState<AssessmentResult[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSavedAssessments(getAssessments())
  }, [])

  const phq9 = useAssessment("phq9", PHQ9)
  const gad7 = useAssessment("gad7", GAD7)

  const handleSubmit = (type: AssessmentType) => {
    if (type === "phq9") phq9.submit()
    else gad7.submit()
    setSavedAssessments(getAssessments())
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="border-b border-border/40 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Clinical Assessments</h1>
              <p className="text-sm text-muted-foreground">
                Validated PHQ-9 and GAD-7 mental health screening tools
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="phq9">
          <TabsList className="grid grid-cols-3 w-full max-w-lg mb-6">
            <TabsTrigger value="phq9" className="text-xs gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              PHQ-9 Depression
            </TabsTrigger>
            <TabsTrigger value="gad7" className="text-xs gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              GAD-7 Anxiety
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1.5">
              <History className="w-3.5 h-3.5" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phq9">
            <AssessmentForm
              type="phq9"
              title="PHQ-9 Depression Screening"
              description="Over the last 2 weeks, how often have you been bothered by any of the following problems?"
              questions={PHQ9}
              assessment={phq9}
              onSubmit={() => handleSubmit("phq9")}
            />
          </TabsContent>

          <TabsContent value="gad7">
            <AssessmentForm
              type="gad7"
              title="GAD-7 Anxiety Screening"
              description="Over the last 2 weeks, how often have you been bothered by any of the following problems?"
              questions={GAD7}
              assessment={gad7}
              onSubmit={() => handleSubmit("gad7")}
            />
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-2xl space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assessment History</h3>
              {savedAssessments.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-border/40">
                  <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/60">No assessments taken yet.</p>
                </div>
              ) : (
                savedAssessments.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border/40 bg-card/40 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold font-display">
                          {a.type === "phq9" ? "PHQ-9 — Depression" : "GAD-7 — Anxiety"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(a.timestamp)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-display" style={{ color: a.severityColor }}>{a.totalScore}</p>
                        <p className="text-xs font-medium" style={{ color: a.severityColor }}>{a.severity}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{a.nextSteps}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 rounded-xl bg-muted/20 border border-border/30 max-w-2xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> These tools are for educational and informational purposes only.
            They are not diagnostic instruments. Only a qualified healthcare professional can provide a proper mental health diagnosis.
            If you are in crisis, please contact emergency services or a mental health crisis line.
          </p>
        </div>
      </div>
    </div>
  )
}

interface FormProps {
  type: AssessmentType
  title: string
  description: string
  questions: string[]
  assessment: ReturnType<typeof useAssessment>
  onSubmit: () => void
}

function AssessmentForm({ title, description, questions, assessment, onSubmit }: FormProps) {
  const { state, setAnswer, next, prev, submit, reset, isComplete, progress } = assessment
  const q = state.currentQuestion

  if (state.result) {
    const r = state.result
    return (
      <div className="max-w-2xl animate-scale-in space-y-5">
        <div className="rounded-2xl border p-6 text-center" style={{ borderColor: r.severityColor + "40", background: r.severityColor + "10" }}>
          {r.totalScore < 5 ? (
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: r.severityColor }} />
          ) : (
            <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: r.severityColor }} />
          )}
          <p className="text-4xl font-bold font-display mb-1" style={{ color: r.severityColor }}>{r.totalScore}</p>
          <p className="text-lg font-semibold mb-2">{r.severity}</p>
          <p className="text-sm text-muted-foreground">{r.nextSteps}</p>
        </div>

        {/* Score bar */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Score Breakdown</p>
          <div className="h-3 rounded-full overflow-hidden bg-muted flex">
            <div className="bg-green-500 flex-[5]" title="Minimal" />
            <div className="bg-yellow-500 flex-[5]" title="Mild" />
            <div className="bg-orange-500 flex-[5]" title="Moderate" />
            <div className="bg-red-500 flex-[5]" title="Moderately Severe" />
            <div className="bg-red-700 flex-[7]" title="Severe" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Minimal</span><span>Mild</span><span>Moderate</span><span>Mod. Severe</span><span>Severe</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommendations</p>
          {r.recommendations.map((rec) => (
            <div key={rec} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              {rec}
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={reset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Retake Assessment
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-bold font-display">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {q + 1} of {questions.length}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 animate-fade-in">
        <p className="text-base font-medium mb-5">{questions[q]}</p>
        <RadioGroup
          value={state.answers[q] !== undefined ? String(state.answers[q]) : ""}
          onValueChange={(v) => setAnswer(q, Number(v))}
          className="space-y-3"
        >
          {OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all",
                state.answers[q] === opt.value
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/40 hover:border-border/70 hover:bg-muted/30"
              )}
            >
              <RadioGroupItem value={String(opt.value)} id={`q${q}-${opt.value}`} />
              <Label htmlFor={`q${q}-${opt.value}`} className="cursor-pointer flex-1">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prev} disabled={q === 0} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        {q < questions.length - 1 ? (
          <Button onClick={next} disabled={state.answers[q] === undefined} className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={!isComplete} className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <CheckCircle2 className="w-4 h-4" />
            Submit Assessment
          </Button>
        )}
      </div>

      {/* Quick answer all remaining hint */}
      {Object.keys(state.answers).length < questions.length && (
        <p className="text-xs text-muted-foreground text-center">
          {questions.length - Object.keys(state.answers).length} question{questions.length - Object.keys(state.answers).length !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  )
}
