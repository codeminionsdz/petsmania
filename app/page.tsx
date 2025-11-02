"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Truck, Shield, TrendingUp } from "lucide-react"
import { PromotionalBanner } from "@/components/promotional-banner"
import { FeaturedProducts } from "@/components/featured-products"
import { OutOfStockProducts } from "@/components/out-of-stock-products"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function Home() {
  const { language } = useTheme()
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState([
    {
      name: t("cats", language),
      href: "/categories/cats",
      emoji: "🐱",
      color: "from-pink-300 to-pink-400",
      count: "0 " + t("products", language),
      animal: "cats",
    },
    {
      name: t("dogs", language),
      href: "/categories/dogs",
      emoji: "🐕",
      color: "from-amber-300 to-amber-400",
      count: "0 " + t("products", language),
      animal: "dogs",
    },
    {
      name: t("birds", language),
      href: "/categories/birds",
      emoji: "🦜",
      color: "from-green-300 to-green-400",
      count: "0 " + t("products", language),
      animal: "birds",
    },
    {
      name: t("other", language),
      href: "/categories/other",
      emoji: "🐾",
      color: "from-purple-300 to-purple-400",
      count: "0 " + t("products", language),
      animal: "other",
    },
  ])

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)

    // Fetch product counts for each category
    fetchProductCounts()
  }, [])

  const fetchProductCounts = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("products")
        .select("animal")

      if (error) throw error

      // Count products by animal
      const counts = data?.reduce((acc: Record<string, number>, product: { animal: string }) => {
        acc[product.animal] = (acc[product.animal] || 0) + 1
        return acc
      }, {}) || {}

      setCategories(prev => prev.map(cat => ({
        ...cat,
        count: `${counts[cat.animal] || 0} ${t("products", language)}`
      })))
    } catch (error) {
      console.error("Error fetching product counts:", error)
    }
  }

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartCount} />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 py-20 md:py-32">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-16 left-16 text-6xl animate-bounce opacity-30" style={{ animationDelay: '0s', animationDuration: '3s' }}>🐱</div>
            <div className="absolute top-32 right-24 text-5xl animate-pulse opacity-25" style={{ animationDelay: '1s', animationDuration: '4s' }}>🐶</div>
            <div className="absolute bottom-32 left-1/3 text-4xl animate-bounce opacity-35" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>🐱</div>
            <div className="absolute bottom-16 right-1/4 text-5xl animate-pulse opacity-30" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>🐶</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl animate-spin opacity-20" style={{ animationDelay: '1.5s', animationDuration: '5s' }}>🐾</div>
            <div className="absolute top-1/4 right-1/3 text-5xl animate-bounce opacity-25" style={{ animationDelay: '3s', animationDuration: '4s' }}>🐕</div>
            <div className="absolute bottom-1/4 left-1/5 text-4xl animate-pulse opacity-30" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }}>🐈</div>
            <div className="absolute top-10 right-10 text-4xl animate-bounce opacity-25" style={{ animationDelay: '2.5s', animationDuration: '3s' }}>🐾</div>
            <div className="absolute bottom-10 left-10 text-5xl animate-pulse opacity-20" style={{ animationDelay: '0.8s', animationDuration: '4s' }}>🐾</div>
            <div className="absolute top-3/4 right-1/5 text-3xl animate-bounce opacity-30" style={{ animationDelay: '1.2s', animationDuration: '3.5s' }}>🐾</div>
          </div>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <div className="mb-4 inline-block">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                    <TrendingUp className="w-4 h-4" />
                    Nouveau et Tendance
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {t("bestPetsSupplies", language)} <span className="text-primary">PetHouse</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("qualityProducts", language)}
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("fastDelivery", language)}
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("bestPrices", language)}
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/categories/cats">
                    <Button size="lg" className="gap-2">
                      {t("shop", language)} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      {t("about", language)}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-96 md:h-full animate-scale-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl h-full flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-4 w-full h-full p-4">
                    <div className="relative rounded-2xl overflow-hidden w-full max-w-md h-48">
                      <Image
                        src="https://i.imgur.com/dQcwKIp.jpeg"
                        alt="مرحبا بك في PetHouse"
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                      <div className="relative rounded-xl overflow-hidden h-24">
                        <Image
                          src="https://i.imgur.com/5ldxbx5.png"
                          alt="Pet supplies"
                          width={150}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="relative rounded-xl overflow-hidden h-24">
                        <Image
                          src="https://wallpapercave.com/wp/wp2544022.jpg"
                          alt="Pet care"
                          width={150}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <PromotionalBanner />

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("whyChooseUs", language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: t("qualityProducts", language),
                  desc: t("qualityProductsDesc", language),
                },
                {
                  icon: Truck,
                  title: t("fastDelivery", language),
                  desc: t("fastDeliveryDesc", language),
                },
                {
                  icon: Shield,
                  title: t("securePurchase", language),
                  desc: t("securePurchaseDesc", language),
                },
              ].map((feature, i) => (
                <Card
                  key={i}
                  className="p-8 text-center hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <FeaturedProducts />



        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("shopByCategory", language)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <Link key={i} href={cat.href}>
                  <Card
                    className="p-8 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 animate-scale-in overflow-hidden group"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="relative">
                      <div
                        className={`bg-gradient-to-br ${cat.color} rounded-full w-20 h-20 flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform`}
                      >
                        {cat.emoji}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.count}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offer Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-secondary/20 to-accent/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("freeShippingFrom", language)}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("startShopping", language)}
            </p>
            <Link href="/categories/cats">
              <Button size="lg" className="gap-2">
                {t("startShopping", language)} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
