"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, AlertTriangle as MainAlert, CheckCircle as CheckCircleIcon, XCircle } from "lucide-react"

interface ConnectionStatus {
  url: boolean
  anonKey: boolean  
  serviceRoleKey: boolean
  isConfigured: boolean
  error?: string
}

export default function SupabaseStatusSimple() {
  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const status: ConnectionStatus = {
    url: url && url !== 'your_supabase_project_url',
    anonKey: anonKey && anonKey !== 'your_supabase_anon_key',  
    serviceRoleKey: !!serviceRoleKey,
    isConfigured: url && url !== 'your_supabase_project_url' && anonKey !== 'your_supabase_anon_key'
  }

  const getColor = () => {
    if (status.isConfigured) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (!status.url && !status.anonKey && !status.serviceRoleKey) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }

  const getIcon = () => {
    if (status.isConfigured) return <CheckCircle className="h-4 w-4" />
    if (!status.url && !status.anonKey && !status.serviceRoleKey) return <XCircle className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  const getText = () => {
    if (status.isConfigured) return '✅ Connected'
    if (!status.url && !status.anonKey && !status.serviceRoleKey) return '❌ Not Configured'
    return '⚠️ Needs Configuration'
  }

  return (
    <Card className={`${getColor()} transition-colors duration-300`}>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-white/70 dark:bg-gray-800/50 ${status.isConfigured ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'} flex items-center justify-center`}>
            {getIcon()}
          </div>
          <div>
            <CardTitle className="text-lg">Supabase Status</CardTitle>
            <CardDescription>
              {getText()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Status Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_URL:</span>
            <Badge variant={status.url ? "default" : "destructive"}>
              <span className={status.url ? "line-clamp-1" : ""}>
                {status.url ? url?.split("//")[2] || url?.slice(0, 15) : 'Not Set'}
              </span>
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
            <Badge variant={status.anonKey ? "default" : "destructive"}>
              <span className={status.anonKey ? "line-clamp-1" : ""}>
                {status.anonKey ? anonKey.slice(0, 15) + '...' : 'Not Set'}
              </span>
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">SUPABASE_SERVICE_ROLE_KEY:</span>
            <Badge variant={status.serviceRoleKey ? "default" : "destructive"}>
              <span className={status.serviceRoleKey ? 'Set' : 'Not Set'} />
            </Badge>
          </div>
        </div>
      </CardContent>

      {!status.isConfigured && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-sm text-green-800 dark:text-green-200">
            🎉 Ready to use! Your database connection is properly configured.
          </p>
        </div>
      )}

      {!status.isConfigured && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>Need help configuring Supabase? <a href="/supabase-debug" className="text-amber-600 hover:text-amber-700 underline">View Debug Page</a></p>
        </div>
      )}
    </Card>
  )
}
