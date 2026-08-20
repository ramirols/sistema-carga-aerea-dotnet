import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AppProvider } from "@/providers/app-provider"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Sistema de Carga Aérea",
    template: "%s | Sistema de Carga Aérea",
  },
  description:
    "Administración de vuelos, encomiendas y carga aérea.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}