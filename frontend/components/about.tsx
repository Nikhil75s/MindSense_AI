import { Brain, HeartPulse, LineChart, ShieldCheck, Clock } from "lucide-react"

const cards = [
  {
    icon: Brain,
    title: "NLP & Machine Learning",
    description:
      "State-of-the-art ensemble models including BERT, RoBERTa, DistilBERT, and SVM analyze text across 8 emotional dimensions with high confidence.",
    gradient: "from-indigo-500/10 to-purple-500/5",
    iconGradient: "from-indigo-500 to-purple-600",
    border: "border-indigo-500/20",
  },
  {
    icon: HeartPulse,
    title: "Actionable Intelligence",
    description:
      "Transforms raw text analysis into meaningful, context-aware suggestions, highlighting specific areas for emotional and mental well-being improvement.",
    gradient: "from-pink-500/10 to-rose-500/5",
    iconGradient: "from-pink-500 to-rose-600",
    border: "border-pink-500/20",
  },
  {
    icon: LineChart,
    title: "Continuous Monitoring",
    description:
      "Track mental health trends over time with interactive visualizations, enabling proactive intervention and data-driven wellness strategies.",
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconGradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/20",
  },
]

const reasons = [
  { icon: ShieldCheck, text: "Privacy-first — your data never leaves your device" },
  { icon: Brain, text: "8 emotion categories with sentence-level granularity" },
  { icon: HeartPulse, text: "Context-aware AI-driven actionable suggestions" },
  { icon: Clock, text: "Analysis results in under 2 seconds" },
  { icon: LineChart, text: "Persistent history and trend analytics dashboard" },
  { icon: ShieldCheck, text: "GDPR-friendly design with zero third-party tracking" },
]

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            About the Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Understanding Mental Health{" "}
            <span className="gradient-text">Through AI</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our system applies advanced sentiment analysis to mental wellness, providing valuable insights
            for early intervention and continuous monitoring.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`relative rounded-2xl p-6 bg-gradient-to-br ${card.gradient} border ${card.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl backdrop-blur-sm group`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconGradient} flex items-center justify-center shadow-lg mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold font-display mb-6">Why It Matters</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reasons.map((r) => (
              <div key={r.text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <r.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
