"use client"

import { GraduationCap, Users, Server } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function About() {
  const { t } = useI18n()

  return (
    <section id="sobre" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="mb-2 block font-mono text-sm text-primary">
            {t("about.section")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("about.title")}
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-5">
          <div className="space-y-5 md:col-span-3">
            <p className="leading-relaxed text-muted-foreground">
              {t("about.p1.prefix")}
              <strong className="text-foreground">
                {t("about.p1.degree")}
              </strong>
              {t("about.p1.mid")}
              <strong className="text-foreground">
                {t("about.p1.postgrad")}
              </strong>
              {t("about.p1.suffix")}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {t("about.p2")}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {t("about.p3")}
            </p>
          </div>

          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {t("about.card1.title")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("about.card1.desc")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <GraduationCap className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {t("about.card2.title")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("about.card2.desc")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {t("about.card3.title")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("about.card3.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
