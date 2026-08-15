import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindSense AI — Mental Health Sentiment Analysis Platform",
  description:
    "AI-powered mental health sentiment analysis platform using advanced NLP and machine learning. Detect emotions, assess mental health risk, and gain personalized insights.",
  keywords:
    "mental health, sentiment analysis, NLP, AI, emotion detection, depression, anxiety, wellness",
  authors: [{ name: "MindSense AI" }],
  openGraph: {
    title: "MindSense AI — Mental Health Sentiment Analysis",
    description: "Advanced AI-powered emotional intelligence and mental health assessment platform.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
