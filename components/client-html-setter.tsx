"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect } from "react"

export function ClientHtmlSetter() {
  const { language } = useTheme()

  useEffect(() => {
    const html = document.documentElement
    html.lang = language
    html.dir = language === "ar" ? "rtl" : "ltr"
    html.className = html.className.replace(/\b(rtl|ltr)\b/g, '') + (language === "ar" ? " rtl" : " ltr")
  }, [language])

  return null
}
