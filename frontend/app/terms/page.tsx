import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="-ml-4 mb-4 text-muted-foreground hover:text-primary">
            <Link href="/">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold font-display tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using MindSense AI ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Not Medical Advice</h2>
            <p className="text-muted-foreground leading-relaxed">
              MindSense AI provides sentiment analysis and emotional intelligence tools for informational purposes only. The Platform is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use the Platform only for lawful purposes. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Use the Platform in any way that violates applicable local, national, or international law.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform or its related systems.</li>
              <li>Upload or transmit harmful code, viruses, or any material that disrupts the Platform's functionality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, MindSense AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
