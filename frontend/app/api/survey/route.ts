import { NextResponse } from "next/server"

// PHQ-9 score interpretation
function interpretPhq9Score(score: number) {
  let severity = ""
  let color = ""

  if (score >= 0 && score <= 4) {
    severity = "Minimal depression"
    color = "text-green-500"
  } else if (score >= 5 && score <= 9) {
    severity = "Mild depression"
    color = "text-yellow-500"
  } else if (score >= 10 && score <= 14) {
    severity = "Moderate depression"
    color = "text-orange-500"
  } else if (score >= 15 && score <= 19) {
    severity = "Moderately severe depression"
    color = "text-red-500"
  } else {
    severity = "Severe depression"
    color = "text-red-700"
  }

  return { score, severity, color }
}

// GAD-7 score interpretation
function interpretGad7Score(score: number) {
  let severity = ""
  let color = ""

  if (score >= 0 && score <= 4) {
    severity = "Minimal anxiety"
    color = "text-green-500"
  } else if (score >= 5 && score <= 9) {
    severity = "Mild anxiety"
    color = "text-yellow-500"
  } else if (score >= 10 && score <= 14) {
    severity = "Moderate anxiety"
    color = "text-orange-500"
  } else {
    severity = "Severe anxiety"
    color = "text-red-500"
  }

  return { score, severity, color }
}

export async function POST(request: Request) {
  try {
    const { surveyType, answers } = await request.json()

    if (!surveyType || !answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Survey type and answers are required" }, { status: 400 })
    }

    // Calculate score
    const score = (Object.values(answers) as (string | number)[]).reduce(
      (sum: number, value) => sum + (typeof value === "number" ? value : parseInt(String(value), 10)),
      0
    )

    // Interpret score based on survey type
    let result
    if (surveyType === "phq9") {
      result = interpretPhq9Score(score)
    } else if (surveyType === "gad7") {
      result = interpretGad7Score(score)
    } else {
      return NextResponse.json({ error: "Invalid survey type" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing survey:", error)
    return NextResponse.json({ error: "Failed to process survey" }, { status: 500 })
  }
}
