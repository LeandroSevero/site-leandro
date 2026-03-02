"use client"

import { useI18n } from "@/lib/i18n"

const skills = [
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "GCP", category: "Cloud" },
  { name: "Docker", category: "Containers" },
  { name: "Kubernetes", category: "Containers" },
  { name: "Linux", category: "OS" },
  { name: "Windows Server", category: "OS" },
  { name: "Elastic Stack", category: "Monitoring" },
  { name: "RabbitMQ", category: "Messaging" },
  { name: "MongoDB", category: "Database" },
  { name: "Azure DevOps", category: "CI/CD" },
  { name: "Veeam Backup", category: "Backup" },
  { name: "Fortinet", category: "Security" },
  { name: "Microsoft 365", category: "Productivity" },
  { name: "Active Directory", category: "Identity" },
]

export function Skills() {
  const { t } = useI18n()

  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <span className="mb-2 block font-mono text-sm text-primary">
            {t("skills.section")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("skills.title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="text-sm font-medium text-foreground">
                {skill.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
