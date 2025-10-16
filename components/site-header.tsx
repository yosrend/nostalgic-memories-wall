"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-supabase-auth"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const { signOut, user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/sign-in')
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          {user?.email && (
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
