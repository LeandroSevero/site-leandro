"use client"

import { Mail, Linkedin, Instagram, MapPin } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Contact() {
  const { t } = useI18n()

  return (
    <section id="contato" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="mb-2 block font-mono text-sm text-primary">
            {t("contact.section")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("contact.title")}
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            {t("contact.desc")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="mailto:leandroolise@gmail.com"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t("contact.email")}</p>
              <p className="truncate text-sm font-medium text-foreground">
                leandroolise@gmail.com
              </p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/leandrosevero"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Linkedin className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">LinkedIn</p>
              <p className="truncate text-sm font-medium text-foreground">
                /in/leandrosevero
              </p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/leeandro.sv/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Instagram className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Instagram</p>
              <p className="truncate text-sm font-medium text-foreground">
                @leeandro.sv
              </p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t("contact.location")}</p>
              <p className="truncate text-sm font-medium text-foreground">
                {t("contact.locationValue")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
