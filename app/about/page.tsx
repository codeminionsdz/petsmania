"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Users, Award, Heart } from "lucide-react"

export default function AboutPage() {
  const { language } = useTheme()
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartCount} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("aboutUs", language)}</h1>
            <p className="text-lg text-muted-foreground">
              {t("bestPetsSupplies", language)}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold mb-6">{t("ourStory", language)}</h2>
                <p className="text-muted-foreground mb-4">
                  {t("bestPetsSupplies", language)}
                </p>
                <p className="text-muted-foreground mb-4">
                  {t("qualityProducts", language)}
                </p>
                <p className="text-muted-foreground">
                  {t("fastDelivery", language)}
                </p>
              </div>

              <div className="relative h-96 animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-primary font-semibold">Your Pet's Home</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("ourValues", language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: t("petCare", language),
                  desc: t("petCareDesc", language),
                },
                {
                  icon: Award,
                  title: t("quality", language),
                  desc: t("qualityDesc", language),
                },
                {
                  icon: Users,
                  title: t("community", language),
                  desc: t("communityDesc", language),
                },
              ].map((value, i) => (
                <Card
                  key={i}
                  className="p-8 text-center hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">{t("ourTeam", language)}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("teamDesc", language)}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
