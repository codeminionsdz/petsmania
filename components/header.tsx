"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { t, type Language } from "@/lib/i18n"
import { useTheme } from "@/components/theme-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, Search, User, LogOut, Heart, LogIn, Moon, Sun } from "lucide-react"

interface HeaderProps {
  cartCount: number
}

export function Header({ cartCount }: HeaderProps) {
  const { language: themeLanguage, isDark, toggleTheme } = useTheme()
  const currentLanguage = themeLanguage
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const animalCategories = [
    { name: t("cats", currentLanguage), href: "/categories/cats", emoji: "🐱" },
    { name: t("dogs", currentLanguage), href: "/categories/dogs", emoji: "🐕" },
    { name: t("birds", currentLanguage), href: "/categories/birds", emoji: "🦜" },
    { name: t("other", currentLanguage), href: "/categories/other", emoji: "🐾" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="PetHouse"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-lg text-primary hidden sm:inline">PetHouse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("home", currentLanguage)}
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium">
                {t("shop", currentLanguage)}
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {animalCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                  >
                    <span className="mr-2">{cat.emoji}</span>
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-border my-2"></div>
                <Link
                  href="/search"
                  className="block px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  {t("search", currentLanguage)}
                </Link>
              </div>
            </div>

            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("about", currentLanguage)}
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("contact", currentLanguage)}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Link href="/search" className="hidden sm:block">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            {user && (
              <Link href="/wishlist" className="hidden sm:block">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 mt-0 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                    {user.firstName} {user.lastName}
                  </div>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                  >
                    {t("orders", currentLanguage)}
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                  >
                    {t("profile", currentLanguage)}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout", currentLanguage)}
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="icon">
                  <LogIn className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("home", currentLanguage)}
            </Link>
            <div className="pl-4 space-y-2 border-l-2 border-primary">
              {animalCategories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="block text-foreground hover:text-primary transition-colors text-sm"
                >
                  <span className="mr-2">{cat.emoji}</span>
                  {cat.name}
                </Link>
              ))}
              <Link href="/search" className="block text-foreground hover:text-primary transition-colors text-sm">
                <Search className="w-4 h-4 inline mr-2" />
                {t("search", currentLanguage)}
              </Link>
            </div>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("about", currentLanguage)}
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("contact", currentLanguage)}
            </Link>
            {user && (
              <>
                <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors font-medium">
                  <Heart className="w-4 h-4 inline mr-2" />
                  {t("wishlist", currentLanguage)}
                </Link>
                <Link href="/orders" className="text-foreground hover:text-primary transition-colors font-medium">
                  {t("orders", currentLanguage)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t("logout", currentLanguage)}
                </button>
              </>
            )}
            {!user && (
              <Link href="/auth/login" className="text-foreground hover:text-primary transition-colors font-medium">
                <LogIn className="w-4 h-4 inline mr-2" />
                {t("login", currentLanguage)}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
