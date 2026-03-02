import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Leandro Severo | Supervisor de DevOps & Infraestrutura Cloud",
  description:
    "Profissional de DevOps com experiência em AWS, Azure, Kubernetes, Docker, Linux e Cybersecurity. Supervisor de DevOps em Curitiba - PR.",
  keywords: [
    "DevOps",
    "AWS",
    "Azure",
    "Kubernetes",
    "Docker",
    "Infraestrutura",
    "Cloud",
    "Cybersecurity",
    "Curitiba",
    "Leandro Severo",
  ],
  authors: [{ name: "Leandro Severo" }],
  openGraph: {
    title: "Leandro Severo | Supervisor de DevOps & Infraestrutura Cloud",
    description:
      "Profissional de DevOps com experiência em AWS, Azure, Kubernetes, Docker, Linux e Cybersecurity.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leandro Severo | Supervisor de DevOps",
    description:
      "Supervisor de DevOps com experiência em AWS, Azure, Kubernetes e Cybersecurity.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1729" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
