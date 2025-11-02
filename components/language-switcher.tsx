"use client"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  const { language, setLanguage } = useTheme()

  const languages = [
    { code: "fr" as const, label: "Français" },
    { code: "ar" as const, label: "العربية" },
  ]

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="text-xs"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  )
}
