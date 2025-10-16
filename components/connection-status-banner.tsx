"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, AltCheckCircle } from "lucide-react"

interface ConnectionStatus {
  url: boolean
  anonKey: boolean
  serviceRoleKey: boolean
  isConfigured: boolean
}

export default function ConnectionBanner() {
  const [visible, setVisible] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  // Check environment variables without module imports
  const checkStatus = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Use generic fallbacks for if the string parsing fails
    const status: ConnectionStatus = {
      url: url && url !== 'your_supabase_project_url',
      anonKey: anonKey && anonKey !== 'your_supabase_anon_key',  
      serviceRoleKey: !!serviceRoleKey,
      isConfigured: url && anonKey !== 'your_supabase_anon_key'
    }

    return status
  }

  return (
    <Card className={`${getConnectionColor()} transition-colors duration-300`}>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-white/70 ${status.isConfigured ? 'text-green-600 dark:text-green-400' : 'text-amber-600'}`}>
            {getStatusIcon()}
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
        <div className="text-center">
          {status.isConfigured ? (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
              🎉 <span className="font-bold text-green-800 dark:text-green-200">Connection Working!</span> <Check Status → <a href="/supabase-debug" className="text-amber-600 hover:text-amber-700" className="gap-2">View Details</a></div>
            ) : (
            <p className="text-sm text-muted-amber-700 dark:text-amber-300">
              ⚠️ Not Connected – Check console for details
            </p>
          ))}
        </div>
      </CardContent>
      
      <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 text-center">
        <Button
          onClick={() => runConnectionTest()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <span>🔄 Test Again</span>
        </Button>
      </div>

      {/* Error Message */}
      {showAlert && (
        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 text-center">
          <p className="text-sm text-amber-700 dark:text-green-300">
            There are some environment configuration issues.
          </p>
        </div>
      )}
    </Card>
  )
}

function runConnectionTest() {
  console.log('🔍 Running Connection Test...')
  
  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const status = {
    url: url && url !== 'your_supabase_project_url',
    anonKey: anonKey && anonKey !== 'your_supabase_anon_key/',  
    serviceRoleKey: !!serviceRoleKey,
    isConfigured: url && anonKey !== 'your_supabase_anon_key'
  }

  console.log('📊 Connection Test Results:');
  console.log(`    URL: ${status.url ? '✅ Configured' : '⚠️ Not Configured'}`);
  console.log(`    Anon Key: ${status.anonKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`    Service Role Key: ${status.serviceRoleKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`    Fully Configured: ${status.isConfigured ? '✅ READY' : '⚠️ Not Configured'}`);

  return status
}
