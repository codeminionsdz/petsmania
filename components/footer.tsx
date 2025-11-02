"use client"

import Link from "next/link"
import { t } from "@/lib/i18n"
import { useTheme } from "@/components/theme-provider"
import { Mail, Phone, MapPin, Instagram } from "lucide-react"

export function Footer() {
  const { language } = useTheme()
  const isArabic = language === "ar"

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">PetHouse</h3>
            <p className="text-muted-foreground text-sm">
              {t("trustedPetSupplies", language)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("shop", language)}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=cats" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("cats", language)}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=dogs" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("dogs", language)}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=birds"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("birds", language)}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=other"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("other", language)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{t("company", language)}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("aboutUs", language)}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("contactUs", language)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contactUs", language)}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>0782061149</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@pethouse.com</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Bordj Bou Arreridj, RUE CHEBABI MESSAOUD</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Instagram className="w-4 h-4" />
                <a
                  href="https://www.instagram.com/pethouse.bba?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @pethouse.bba
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 PetHouse. {t("allRightsReserved", language)}</p>
        </div>
      </div>
    </footer>
  )
}
