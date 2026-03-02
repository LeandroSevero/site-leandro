"use client"

import { useI18n } from "@/lib/i18n"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === "pt-BR" ? "en" : "pt-BR")}
      className="relative flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label={locale === "pt-BR" ? "Switch to English" : "Mudar para Portugues"}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{locale === "pt-BR" ? "EN" : "PT"}</span>
    </button>
  )
}
