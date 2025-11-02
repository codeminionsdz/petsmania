import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientHtmlSetter } from "@/components/client-html-setter"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PetHouse - Premium Pet Supplies Store",
  description:
    "Your trusted pet supplies store with quality products for cats, dogs, birds and more. Shop premium pet food, toys, and accessories from trusted brands.",
  keywords: "pet supplies, pet store, cats, dogs, birds, pet food, pet toys, pet accessories",
  openGraph: {
    title: "PetHouse - Premium Pet Supplies",
    description: "Quality pet supplies for all your beloved pets",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider defaultLanguage="fr">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
