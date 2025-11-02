"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { t } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const { language } = useTheme()
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  useEffect(() => {
    setMounted(true)
    const cart = localStorage.getItem("cart")
    if (cart) setCartCount(JSON.parse(cart).length)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
  }

  if (!mounted) return null

  return (
    <div>
      <Header cartCount={cartCount} />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("contactUs", language)}</h1>
            <p className="text-lg text-muted-foreground">
              {t("haveQuestions", language)}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">{t("sendUsMessage", language)}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("name", language)}</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t("email", language)}</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t("message", language)}</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="Your message"
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {t("send", language)}
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6 animate-scale-in">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{t("phone", language)}</h3>
                      <p className="text-muted-foreground">0782061149</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{t("email", language)}</h3>
                      <p className="text-muted-foreground">info@pethouse.com</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{t("address", language)}</h3>
                      <p className="text-muted-foreground">Bordj Bou Arreridj, RUE CHEBABI MESSAOUD</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <h3 className="font-semibold mb-2">{t("businessHours", language)}</h3>
                  <p className="text-muted-foreground text-sm">{t("mondayFriday", language)}: 9:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground text-sm">{t("saturday", language)}: 10:00 AM - 4:00 PM</p>
                  <p className="text-muted-foreground text-sm">{t("sunday", language)}: {t("closed", language)}</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t("findUs", language)}</h2>
            <div className="w-full h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4006.076325959675!2d4.7502797999999995!3d36.068679200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128cbd115500459d%3A0xda54a6eed77b7473!2sPet%20house%20BBA!5e1!3m2!1sen!2sdz!4v1761926206028!5m2!1sen!2sdz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
