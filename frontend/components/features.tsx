import { Globe, BarChart3, Shield, Zap, FileText, Layers, RefreshCw, Brain, History, Download, Lock, Cpu } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Process text instantly with results in under 2 seconds using our ensemble NLP engine.",
    gradient: "from-yellow-500/20 to-orange-500/10",
    iconColor: "text-yellow-500",
    border: "border-yellow-500/20",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Automatic language detection with consistent emotion analysis across multiple languages.",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    icon: Layers,
    title: "8 Emotion Categories",
    description: "Classify text across Depression, Anxiety, Stress, Happiness, Anger, Fear, Sadness, and Neutral.",
    gradient: "from-indigo-500/20 to-purple-500/10",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/20",
  },
  {
    icon: FileText,
    title: "Multi-Format Input",
    description: "Analyze text, TXT/PDF/DOCX file uploads, or direct URL content extraction.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Interactive Dashboard",
    description: "Track trends with line charts, bar charts, pie charts, and mood timeline visualizations.",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
    border: "border-pink-500/20",
  },
  {
    icon: Brain,
    title: "Actionable Insights",
    description: "Receive AI-driven smart suggestions and contextual recommendations based on text analysis.",
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    icon: Cpu,
    title: "Sentence-Level Analysis",
    description: "Break down text sentence-by-sentence with individual emotion, sentiment, and risk scores.",
    gradient: "from-amber-500/20 to-yellow-500/10",
    iconColor: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    icon: History,
    title: "Analysis History",
    description: "Searchable history with date filtering, emotion filtering, and trend comparison tools.",
    gradient: "from-slate-500/20 to-gray-500/10",
    iconColor: "text-slate-400",
    border: "border-slate-500/20",
  },
  {
    icon: RefreshCw,
    title: "Explainable AI",
    description: "Understand why each emotion was detected with confidence scores and insight explanations.",
    gradient: "from-teal-500/20 to-cyan-500/10",
    iconColor: "text-teal-400",
    border: "border-teal-500/20",
  },
  {
    icon: Download,
    title: "Export Reports",
    description: "Download analysis history and assessment results as JSON for personal records.",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400",
    border: "border-green-500/20",
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "All data stored locally in your browser. No server-side user data retention. GDPR-friendly.",
    gradient: "from-red-500/20 to-rose-500/10",
    iconColor: "text-red-400",
    border: "border-red-500/20",
  },
  {
    icon: Shield,
    title: "HIPAA-Oriented",
    description: "Architecture follows clinical-grade data protection principles for healthcare settings.",
    gradient: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/20",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Everything You Need for{" "}
            <span className="gradient-text">Mental Wellness</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive suite of AI-powered tools designed for personal wellness monitoring
            and clinical mental health assessment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`relative rounded-2xl p-6 bg-gradient-to-br ${feature.gradient} border ${feature.border} transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-${feature.iconColor.split('-')[1]}-500/20 group backdrop-blur-sm`}
            >
              <div className="mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 inline-block">
                <feature.icon className={`w-10 h-10 ${feature.iconColor} drop-shadow-md`} />
              </div>
              <h3 className="text-base font-bold font-display mb-2 text-foreground/90 group-hover:text-foreground transition-colors">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
