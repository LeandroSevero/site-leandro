"use client"

import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Leandro Severo. {t("footer.rights")}
        </p>
      </div>
    </footer>
  )
}
