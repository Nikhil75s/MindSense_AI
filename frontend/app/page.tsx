import Hero from "@/components/hero"
import About from "@/components/about"
import Features from "@/components/features"
import Architecture from "@/components/architecture"
import Demo from "@/components/demo"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Features />
      <Architecture />
      <Demo />
      <Contact />
      <Footer />
    </div>
  )
}
