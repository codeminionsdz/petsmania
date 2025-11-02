"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Language } from "@/lib/i18n"
import { ClientHtmlSetter } from "@/components/client-html-setter"

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  language: Language
  setLanguage: (lang: Language) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return defaults during SSR or before provider mounts
    return {
      isDark: false,
      toggleTheme: () => {},
      language: "fr" as Language,
      setLanguage: () => {},
    }
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultLanguage?: Language
}

export function ThemeProvider({ children, defaultLanguage = "fr" }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const savedLanguage = localStorage.getItem("language") as Language
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }

    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "ar")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  if (!mounted) return children

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, language, setLanguage }}>
      {children}
      <ClientHtmlSetter />
    </ThemeContext.Provider>
  )
}
