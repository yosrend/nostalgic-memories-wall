"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AdminAuthProtectProps {
  children: React.ReactNode
}

export function AdminAuthProtect({ children }: AdminAuthProtectProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if user is authenticated
    const adminAuth = sessionStorage.getItem("admin_auth")
    const loginTime = sessionStorage.getItem("admin_login_time")
    
    // Check if session is valid (24 hours)
    const isValidSession = adminAuth === "true" && 
                         loginTime && 
                         (new Date().getTime() - parseInt(loginTime)) < 24 * 60 * 60 * 1000

    if (isValidSession) {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      // Clear any old session data
      sessionStorage.removeItem("admin_auth")
      sessionStorage.removeItem("admin_login_time")
      
      // Redirect to admin login unless already there
      if (pathname !== "/admin") {
        router.push("/admin")
      }
      setIsLoading(false)
    }
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirecting to login...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
