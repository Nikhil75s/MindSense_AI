"use client"

import { useState, useRef, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Link2, Upload, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  onAnalyze: (text: string, source?: string) => void
  isLoading: boolean
}

const SAMPLE_TEXTS = [
  "I've been feeling really anxious lately and can't seem to stop worrying about everything. My heart races when I think about the future and I can't relax.",
  "Today was such a wonderful day! I feel grateful for everything in my life and excited about the opportunities ahead.",
  "I've been struggling with low energy and a constant feeling of emptiness. Nothing seems to bring me joy anymore and I feel disconnected from people I care about.",
  "Work has been incredibly stressful. There are so many deadlines and responsibilities piling up and I feel completely overwhelmed and burnt out.",
]

export default function InputPanel({ onAnalyze, isLoading }: Props) {
  const [tab, setTab] = useState("text")
  const [text, setText] = useState("")
  const [url, setUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileError, setFileError] = useState("")
  const [urlError, setUrlError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const charCount = text.length

  const handleFileRead = (file: File) => {
    setFileError("")
    const allowed = ["text/plain", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowed.includes(file.type) && !file.name.match(/\.(txt|pdf|docx)$/i)) {
      setFileError("Only TXT, PDF, and DOCX files are supported.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size must be under 5MB.")
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      // Strip non-printable characters for binary files
      const cleaned = content.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim()
      setText(cleaned.slice(0, 50000))
      setTab("text")
    }
    reader.readAsText(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileRead(file)
  }, [])

  const handleUrlAnalyze = async () => {
    if (!url.trim()) return
    setUrlError("")
    try {
      new URL(url)
    } catch {
      setUrlError("Please enter a valid URL (e.g. https://example.com)")
      return
    }
    onAnalyze("__URL__", url)
  }

  const handleSubmit = () => {
    if (tab === "url") {
      handleUrlAnalyze()
    } else if (text.trim().length >= 10) {
      onAnalyze(text)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="text" className="gap-2 text-xs">
            <FileText className="w-3.5 h-3.5" />
            Text
          </TabsTrigger>
          <TabsTrigger value="file" className="gap-2 text-xs">
            <Upload className="w-3.5 h-3.5" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2 text-xs">
            <Link2 className="w-3.5 h-3.5" />
            URL
          </TabsTrigger>
        </TabsList>

        {/* TEXT TAB */}
        <TabsContent value="text" className="mt-4 space-y-3">
          <div className="relative">
            <Textarea
              id="analysis-text-input"
              placeholder="Type or paste your text here... (journal entry, thoughts, feelings, social media post, etc.)"
              className="min-h-[200px] resize-none pr-4 text-sm leading-relaxed"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            {text && (
              <button
                onClick={() => { setText(""); setFileName("") }}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{wordCount} words · {charCount} characters</span>
            {text.length >= 10 && <span className="text-green-500">Ready to analyze</span>}
          </div>

          {/* Sample texts */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Try a sample:</p>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_TEXTS.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => setText(sample)}
                  className="text-left text-xs px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-primary/30 transition-all line-clamp-2 text-muted-foreground hover:text-foreground"
                >
                  {sample.slice(0, 60)}…
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* FILE TAB */}
        <TabsContent value="file" className="mt-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/60 hover:border-primary/40 hover:bg-muted/20"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileRead(f) }}
            />
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            {fileName ? (
              <div>
                <p className="text-sm font-medium text-primary">{fileName}</p>
                <p className="text-xs text-green-500 mt-1">File loaded — switch to Text tab to review</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">Supports TXT, PDF, DOCX · Max 5MB</p>
              </div>
            )}
          </div>
          {fileError && (
            <div className="flex items-center gap-2 text-xs text-red-400 mt-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {fileError}
            </div>
          )}
        </TabsContent>

        {/* URL TAB */}
        <TabsContent value="url" className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="url-input" className="text-sm">Website or Blog URL</Label>
            <div className="flex gap-2">
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError("") }}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
            {urlError && (
              <div className="flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {urlError}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll fetch and extract text from the URL, then run the full NLP analysis pipeline on the content.
          </p>
        </TabsContent>
      </Tabs>

      {/* Analyze Button */}
      <Button
        id="analyze-button"
        onClick={handleSubmit}
        disabled={isLoading || (tab !== "url" && text.trim().length < 10) || (tab === "url" && !url.trim())}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25 h-11"
      >
        {isLoading ? "Analyzing…" : "Run AI Analysis"}
      </Button>
    </div>
  )
}
