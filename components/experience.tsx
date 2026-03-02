"use client"

import { useI18n } from "@/lib/i18n"

export function Experience() {
  const { t } = useI18n()

  const experiences = [
    {
      roleKey: "exp.1.role",
      company: "Employer Tudo do RH",
      periodKey: "exp.1.period",
      location: "Colombo, PR",
      descKey: "exp.1.desc",
      tags: ["AWS", "Azure", "Kubernetes", "Docker", "CI/CD"],
      current: true,
    },
    {
      roleKey: "exp.2.role",
      company: "Employer Tudo do RH",
      periodKey: "exp.2.period",
      location: "Colombo, PR",
      descKey: "exp.2.desc",
      tags: ["Azure DevOps", "AKS", "Docker", "Elastic Stack"],
      current: false,
    },
    {
      roleKey: "exp.3.role",
      company: "Employer Tudo do RH",
      periodKey: "exp.3.period",
      location: "Colombo, PR",
      descKey: "exp.3.desc",
      tags: ["Windows Server", "Linux", "Veeam", "Microsoft 365"],
      current: false,
    },
    {
      roleKey: "exp.4.role",
      company: "Employer Tudo do RH",
      periodKey: "exp.4.period",
      location: "Curitiba, PR",
      descKey: "exp.4.desc",
      tags: ["Helpdesk", "Telecom", "Redes"],
      current: false,
    },
    {
      roleKey: "exp.5.role",
      company: "Employer Tudo do RH",
      periodKey: "exp.5.period",
      location: "Curitiba, PR",
      descKey: "exp.5.desc",
      tags: ["Telecom", "VoIP"],
      current: false,
    },
    {
      roleKey: "exp.6.role",
      company: "Exercito Brasileiro",
      periodKey: "exp.6.period",
      location: "Curitiba, PR",
      descKey: "exp.6.desc",
      tags: ["Liderança", "Disciplina"],
      current: false,
    },
  ]

  return (
    <section id="experiencia" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="mb-2 block font-mono text-sm text-primary">
            {t("exp.section")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("exp.title")}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[7px] w-px bg-border md:left-[140px]" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex gap-6 md:gap-10">
                <div className="hidden w-[120px] flex-shrink-0 text-right md:block">
                  <span className="font-mono text-xs text-muted-foreground">
                    {t(exp.periodKey)}
                  </span>
                </div>

                <div className="relative flex-shrink-0">
                  <div
                    className={`relative z-10 mt-1.5 h-[15px] w-[15px] rounded-full border-2 ${exp.current
                        ? "border-primary bg-primary"
                        : "border-border bg-background"
                      }`}
                  />
                </div>

                <div className="flex-1 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20">
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {t(exp.roleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} &middot; {exp.location}
                      </p>
                    </div>
                    {exp.current && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
                        {t("exp.current")}
                      </span>
                    )}
                  </div>

                  <span className="mb-3 block font-mono text-xs text-muted-foreground md:hidden">
                    {t(exp.periodKey)}
                  </span>

                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {t(exp.descKey)}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
