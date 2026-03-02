"use client"

import Image from "next/image"
import { Linkedin, Instagram, Mail, ArrowDown } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:gap-16">
        <div className="relative flex-shrink-0">
          <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-border md:h-64 md:w-64">
            <Image
              src="/images/leandro.png"
              alt="Leandro Severo"
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 768px) 192px, 256px"
            />
          </div>
          <div className="absolute -right-2 -bottom-2 h-48 w-48 rounded-2xl border border-primary/20 md:h-64 md:w-64" />
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <span className="mb-3 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-xs font-medium tracking-wider text-primary">
            {t("hero.badge")}
          </span>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Leandro Severo
          </h1>

          <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            {t("hero.description")}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/leandrosevero"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/leeandro.sv/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-lg border border-border bg-secondary/50 px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href="#contato"
              className="flex h-11 items-center gap-2 rounded-lg border border-border bg-secondary/50 px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Mail className="h-4 w-4" />
              {t("hero.contact")}
            </a>
          </div>
        </div>
      </div>

      <a
        href="#sobre"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={t("hero.scrollDown")}
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  )
}
