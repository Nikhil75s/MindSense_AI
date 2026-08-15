import { ArrowRight } from "lucide-react"

const layers = [
  {
    id: "input",
    title: "Input Layer",
    color: "#6366f1",
    items: ["Text Input", "File Upload (TXT/PDF/DOCX)", "URL Extraction", "Drag & Drop"],
  },
  {
    id: "nlp",
    title: "NLP Pipeline",
    color: "#a855f7",
    items: ["Text Cleaning", "Language Detection", "Tokenization", "Lemmatization", "Stop Word Removal"],
  },
  {
    id: "ml",
    title: "ML Models",
    color: "#3b82f6",
    items: ["BERT-base", "RoBERTa-mental", "DistilBERT-emotion", "SVM-clinical", "Ensemble Voting"],
  },
  {
    id: "output",
    title: "Output Layer",
    color: "#22c55e",
    items: ["Emotion Scores", "Sentiment Score", "Risk Assessment", "Sentence Analysis", "AI Insights"],
  },
]

const stack = [
  { label: "Next.js 15", category: "Frontend" },
  { label: "TypeScript", category: "Language" },
  { label: "Tailwind CSS", category: "Styling" },
  { label: "Recharts", category: "Visualization" },
  { label: "BERT / RoBERTa", category: "AI Models" },
  { label: "FastAPI", category: "ML Service" },
  { label: "NLTK / spaCy", category: "NLP" },
  { label: "Docker", category: "Deployment" },
]

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            System Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            How{" "}
            <span className="gradient-text">MindSense AI</span>{" "}
            Works
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A modern, layered architecture combining cutting-edge NLP with clinical assessment tools.
          </p>
        </div>

        {/* Pipeline */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:p-10 mb-10">
          <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
            {layers.map((layer, i) => (
              <div key={layer.id} className="flex flex-col md:flex-row items-stretch flex-1">
                <div
                  className="flex-1 rounded-xl p-5 border flex flex-col gap-3"
                  style={{
                    backgroundColor: layer.color + "10",
                    borderColor: layer.color + "30",
                  }}
                >
                  <div
                    className="text-xs font-bold font-display uppercase tracking-wider"
                    style={{ color: layer.color }}
                  >
                    {layer.title}
                  </div>
                  <ul className="space-y-1.5">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {i < layers.length - 1 && (
                  <div className="flex items-center justify-center px-3 text-muted-foreground/40">
                    <ArrowRight className="w-4 h-4 hidden md:block rotate-0" />
                    <ArrowRight className="w-4 h-4 md:hidden rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h3 className="font-bold font-display mb-4">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <div key={s.label} className="flex flex-col items-start">
                  <span className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium border border-border/50">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{s.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h3 className="font-bold font-display mb-4">Future Roadmap</h3>
            <ul className="space-y-2">
              {[
                "Voice Emotion Analysis & Speech-to-Text",
                "Sarcasm & Irony Detection",
                "Crisis & Suicide Risk Detection",
                "AI Therapy Assistant Chatbot",
                "Facial Emotion Recognition (Video)",
                "Wearable Device Integration",
                "Therapist Recommendation System",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
