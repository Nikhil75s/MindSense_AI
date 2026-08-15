import { NextResponse } from "next/server"

// Mock sentiment analysis function
function analyzeSentiment(text: string) {
  // In a real application, this would call a machine learning model
  // For this demo, we'll use a simple keyword-based approach

  const lowerText = text.toLowerCase()

  // Simple keyword detection
  const anxietyKeywords = ["anxious", "worry", "nervous", "fear", "panic"]
  const depressionKeywords = ["sad", "depress", "hopeless", "empty", "tired"]
  const stressKeywords = ["stress", "overwhelm", "pressure", "burden"]
  const positiveKeywords = ["happy", "joy", "good", "great", "excellent"]

  // Count occurrences
  const anxietyScore = anxietyKeywords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0)

  const depressionScore = depressionKeywords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0)

  const stressScore = stressKeywords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0)

  const positiveScore = positiveKeywords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0)

  // Normalize scores (0-100)
  const normalizeScore = (score: number, max: number) => Math.min(Math.round((score / max) * 100), 100)

  // Determine main emotion
  let mainEmotion = "Neutral"
  let description = "Your text doesn't show significant emotional distress."

  const anxietyNormalized = normalizeScore(anxietyScore, anxietyKeywords.length)
  const depressionNormalized = normalizeScore(depressionScore, depressionKeywords.length)
  const stressNormalized = normalizeScore(stressScore, stressKeywords.length)
  const positiveNormalized = normalizeScore(positiveScore, positiveKeywords.length)

  // Add some randomness to make it more realistic
  const randomize = (score: number) => Math.max(0, Math.min(100, score + Math.floor(Math.random() * 30) - 15))

  const scores = [
    {
      emotion: "Anxiety",
      score: randomize(anxietyNormalized || 25),
      color: "text-yellow-500",
    },
    {
      emotion: "Depression",
      score: randomize(depressionNormalized || 18),
      color: "text-blue-500",
    },
    {
      emotion: "Stress",
      score: randomize(stressNormalized || 30),
      color: "text-red-500",
    },
    {
      emotion: "Positive",
      score: randomize(positiveNormalized || 45),
      color: "text-green-500",
    },
  ]

  // Determine main emotion based on highest score
  const highestScore = Math.max(...scores.map((s) => s.score))
  const highestEmotion = scores.find((s) => s.score === highestScore)

  if (highestEmotion) {
    if (highestEmotion.emotion === "Anxiety" && highestEmotion.score > 50) {
      mainEmotion = highestEmotion.score > 70 ? "Moderate Anxiety" : "Mild Anxiety"
      description = "Your text indicates signs of anxiety. Consider using relaxation techniques."
    } else if (highestEmotion.emotion === "Depression" && highestEmotion.score > 50) {
      mainEmotion = highestEmotion.score > 70 ? "Moderate Depression" : "Mild Depression"
      description = "Your text shows indicators of depression. Regular exercise and social connection may help."
    } else if (highestEmotion.emotion === "Stress" && highestEmotion.score > 50) {
      mainEmotion = highestEmotion.score > 70 ? "High Stress" : "Moderate Stress"
      description = "Your text suggests you're experiencing stress. Consider stress management techniques."
    } else if (highestEmotion.emotion === "Positive" && highestEmotion.score > 60) {
      mainEmotion = "Positive Outlook"
      description = "Your text shows a positive emotional state. Keep up the good work!"
    }
  }

  return {
    mainEmotion,
    description,
    scores,
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const analysis = analyzeSentiment(text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing text:", error)
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 })
  }
}
