import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Github, Linkedin, Twitter, Zap, BarChart3, ClipboardList, ShieldCheck } from "lucide-react"

const navLinks = [
  { label: "Analyze", href: "/analyze", icon: Zap },
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: ClipboardList },
  { label: "Admin", href: "/admin", icon: ShieldCheck },
]

const landingLinks = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Architecture", href: "/#architecture" },
  { label: "Demo", href: "/#demo" },
  { label: "Contact", href: "/#contact" },
]

const resources = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "HIPAA Compliance", href: "/hipaa-compliance" },
  { label: "API Reference", href: "/api-reference" },
  { label: "Research Papers", href: "/research" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-bold gradient-text font-display">MindSense AI</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Advanced AI-powered mental health sentiment analysis platform for emotional intelligence and wellness monitoring.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                { icon: Github, label: "GitHub", href: "https://github.com" },
              ].map((s) => (
                <Button key={s.label} variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-primary" asChild>
                  <Link href={s.href} aria-label={s.label}>
                    <s.icon className="w-4 h-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold font-display mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Landing */}
          <div>
            <h3 className="text-sm font-bold font-display mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[...landingLinks, ...resources.slice(0, 2)].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold font-display mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest on mental health AI research and platform updates.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="your@email.com" className="h-9 text-sm flex-1" />
              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MindSense AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Not a substitute for professional medical advice. For emergencies, call your local crisis line.
          </p>
        </div>
      </div>
    </footer>
  )
}
