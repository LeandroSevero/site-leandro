"use client"

import { I18nProvider } from "@/lib/i18n"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Certificates } from "@/components/certificates"
import { Experience } from "@/components/experience"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <I18nProvider>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Certificates />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  )
}
