import type { InsightItem } from "@/lib/types"
import { AlertCircle, CheckCircle2, Info, XCircle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  insights: InsightItem[]
  recommendedAssessments: string[]
}

const TYPE_CONFIG = {
  success: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  warning: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  critical: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
}

export default function InsightsPanel({ insights, recommendedAssessments }: Props) {
  return (
    <div className="space-y-4">
      {/* Insights */}
      {insights.map((insight, idx) => {
        const config = TYPE_CONFIG[insight.type]
        return (
          <div
            key={idx}
            className={cn(
              "rounded-xl border p-4 space-y-2",
              config.bg,
              config.border
            )}
          >
            <div className="flex items-center gap-2">
              <config.icon className={cn("w-4 h-4 flex-shrink-0", config.color)} />
              <p className={cn("text-sm font-semibold", config.color)}>
                {insight.category}
              </p>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{insight.message}</p>
            {insight.recommendation && (
              <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                <Lightbulb className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>
            )}
          </div>
        )
      })}

      {/* Recommended Assessments */}
      {recommendedAssessments.length > 0 && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <p className="text-sm font-semibold text-indigo-400 mb-2">
            Recommended Clinical Assessments
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Based on your analysis, taking these validated assessments may provide additional insights:
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendedAssessments.map((a) => (
              <span
                key={a}
                className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              >
                {a}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-indigo-500/20">
            Visit the <a href="/assessments" className="text-indigo-400 underline underline-offset-2">Assessments</a> page to take these surveys.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-border/30 bg-muted/20 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> This AI analysis is for informational purposes only.
          It is not a diagnostic tool and should not replace professional medical advice.
          If you are experiencing mental health difficulties, please consult a qualified healthcare professional.
        </p>
      </div>
    </div>
  )
}
