"use client"

import { Award, ShieldCheck, Cloud, Network } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Certificates() {
  const { t } = useI18n()

  const highlightedCerts = [
    {
      name: "Fortinet Certified Associate Cybersecurity",
      issuer: "Fortinet",
      dateKey: "certs.fortinet.date",
      icon: ShieldCheck,
    },
    {
      name: "Azure DevOps - CI/CD",
      issuer: "Udemy Brasil",
      dateKey: "certs.azure.date",
      icon: Cloud,
    },
    {
      name: "AWS Cloud Essentials",
      issuer: "Amazon Web Services",
      dateKey: "certs.aws.date",
      icon: Cloud,
    },
  ]

  const otherCerts = [
    {
      nameKey: "certs.seginfo.name",
      issuer: "Fundação Bradesco",
      dateKey: "certs.seginfo.date",
      icon: ShieldCheck,
    },
    {
      nameKey: "certs.lideranca.name",
      issuer: "Supremo Tribunal Federal",
      dateKey: "certs.lideranca.date",
      icon: Award,
    },
    {
      nameKey: "certs.ad.name",
      issuer: "Udemy",
      dateKey: "certs.ad.date",
      icon: Network,
    },
    {
      nameKey: "certs.redes.name",
      issuer: "Udemy Brasil",
      dateKey: "certs.redes.date",
      icon: Network,
    },
    {
      name: "Computer Hardware Basics",
      issuer: "Cisco",
      dateKey: "certs.hardware.date",
      icon: Network,
    },
    {
      name: "Fortinet NSE 1 & 2",
      issuer: "Fortinet",
      dateKey: "certs.fortinetNse.date",
      icon: ShieldCheck,
    },
    {
      nameKey: "certs.da.name",
      issuer: "Project Management Institute",
      dateKey: "certs.da.date",
      icon: Award,
    },
  ]

  return (
    <section id="certificados" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="mb-2 block font-mono text-sm text-primary">
            {t("certs.section")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("certs.title")}
          </h2>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {highlightedCerts.map((cert) => (
            <div
              key={cert.name}
              className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <cert.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold leading-snug text-foreground">
                {cert.name}
              </h3>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              <span className="mt-3 block font-mono text-xs text-primary">
                {t(cert.dateKey)}
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherCerts.map((cert, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                <cert.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium leading-snug text-foreground">
                  {cert.nameKey ? t(cert.nameKey) : cert.name}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {cert.issuer}
                </p>
                <span className="mt-1.5 block font-mono text-xs text-muted-foreground">
                  {t(cert.dateKey)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
