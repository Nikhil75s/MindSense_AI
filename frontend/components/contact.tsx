"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Loader2, Mail, MapPin, Phone, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", organization: "", inquiryType: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: "", email: "", organization: "", inquiryType: "", message: "" })
      }, 4000)
    }, 1500)
  }

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.inquiryType && formData.message.trim()

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Contact{" "}
            <span className="gradient-text">Our Team</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions about MindSense AI? Reach out to our team for more information or to schedule a demo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold font-display mb-5">Send Us a Message</h3>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-lg font-bold font-display mb-2">Message Sent!</h4>
                <p className="text-sm text-muted-foreground">Thank you for reaching out. We&apos;ll respond to your inquiry shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Name *</Label>
                    <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="organization" className="text-xs">Organization</Label>
                  <Input id="organization" name="organization" placeholder="Your organization (optional)" value={formData.organization} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inquiryType" className="text-xs">Inquiry Type *</Label>
                  <Select value={formData.inquiryType} onValueChange={(v) => setFormData((p) => ({ ...p, inquiryType: v }))}>
                    <SelectTrigger id="inquiryType"><SelectValue placeholder="Select inquiry type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Information</SelectItem>
                      <SelectItem value="demo">Request a Demo</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="research">Research Collaboration</SelectItem>
                      <SelectItem value="clinical">Clinical Implementation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs">Message *</Label>
                  <Textarea id="message" name="message" placeholder="Your message…" rows={4} value={formData.message} onChange={handleChange} required />
                </div>
                <Button type="submit" className={cn("w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0")} disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* Info cards */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email", content: "ns6581@srmist.edu.in", color: "#6366f1" },
              { icon: Phone, title: "Phone", content: "+91 96XXXXX52", color: "#22c55e" },
              { icon: MapPin, title: "Location", content: "Delhi, India", color: "#f59e0b" },
            ].map((info) => (
              <div key={info.title} className="rounded-xl border border-border/50 bg-card/50 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: info.color + "20", border: `1px solid ${info.color}30` }}>
                  <info.icon className="w-5 h-5" style={{ color: info.color }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{info.title}</p>
                  <p className="text-sm font-medium">{info.content}</p>
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-border/50 bg-card/50 p-5">
              <h4 className="text-sm font-bold font-display mb-3">For Healthcare Providers</h4>
              <p className="text-xs text-muted-foreground mb-3">We offer specialized support for clinical implementation:</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {["EHR integration support", "HIPAA-compliant deployment", "Clinical validation docs", "Staff training programs"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-4">Request Clinical Resources</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
