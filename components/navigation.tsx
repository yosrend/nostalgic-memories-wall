"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar,
  Sparkles,
  Share2,
  Heart,
  Database
} from "lucide-react"

const navItems = [
  {
    name: "Memory Wall",
    href: "/",
    icon: Home,
    description: "MAHWA 2006 - Browse shared memories"
  },
  {
    name: "Reunion", 
    href: "/reunion",
    icon: Calendar,
    description: "Event details and information"
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Users,
    description: "Manage memories (auto-approved)"
  },
  {
    name: "Database Status",
    href: "/supabase-debug",
    icon: Database,
    description: "Check connection status"
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 relative
                ${
                  isActive 
                    ? "text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {item.name}
              
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-amber-200 dark:bg-amber-800 rounded-lg -z-10"
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="relative"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsOpen(false)}
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed top-0 left-0 z-50 h-full w-64 bg-background/95 backdrop-blur-md border-r border-border md:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-lg">Memories</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium
                            transition-all duration-200
                            ${
                              isActive 
                                ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" 
                                : "text-muted-foreground hover:text-foreground hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                            }
                          `}
                        >
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-center gap-3">
                    <ThemeToggle />
                    <Button size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export function SharedActions() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Button size="sm" className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  )
}
