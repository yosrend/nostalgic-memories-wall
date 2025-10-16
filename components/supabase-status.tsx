"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { testSupabaseConnection, testDatabaseSchema, testStorageConnection } from "@/lib/supabase/connection-test"
import { CheckCircle } from "lucide-react"
import { XCircle } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import { Database } from "lucide-react"
import { Cloud } from "lucide-react"
import { RefreshCw } from "lucide-react"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestResult {
  success: boolean
  error?: string
  details?: string
  databaseInfo?: {
    url: string
    postsCount?: number
  }
  results?: Record<string, any>
  summary?: string
  buckets?: string[]
}

export function SupabaseStatus({ showDetails = false }: { showDetails?: boolean }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<TestResult | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    runConnectionTests()
  }, [showDetails])

  const runConnectionTests = async () => {
    setLoading(true)
    
    try {
      // Run all tests
      const [connectionResult, schemaResult, storageResult] = await Promise.all([
        testSupabaseConnection(),
        testDatabaseSchema(), 
        testStorageConnection()
      ])

      setResults({
        success: connectionResult.success && schemaResult.success && storageResult.success,
        error: !connectionResult.success ? connectionResult.error : 
               !schemaResult.success ? 'Schema issues' : 
               !storageResult.success ? 'Storage issues' : undefined,
        details: `Connection: ${connectionResult.success ? 'OK' : 'FAIL'}, Database: ${schemaResult.success ? 'OK' : 'FAIL'}, Storage: ${storageResult.success ? 'OK' : 'FAIL'}` ,
        databaseInfo: connectionResult.databaseInfo,
        results: schemaResult.results,
        summary: storageResult.summary,
        buckets: storageResult.buckets
      })

    } catch (error) {
      setResults({
        success: false,
        error: 'Failed to run connection tests',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    if (loading) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
    if (!results) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    if (results.success) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  }

  const getStatusIcon = () => {
    if (loading) return <AlertTriangle className="h-4 w-4 animate-spin" />
    if (!results) return <Settings className="h-4 w-4" />
    if (results.success) return <CheckCircle className="h-4 w-4" />
    return <XCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (loading) return 'Testing...'
    if (!results) return 'Not Tested'
    if (results.success) return 'Connected'
    return 'Connection Issues'
  }

  return (
    <Card className={cn(getStatusColor(), "transition-colors duration-300")}>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50">
            {getStatusIcon()}
          </div>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Supabase Status
            </CardTitle>
            <CardDescription>
              {results?.details || 'Click to test connection'}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={results?.success ? "default" : "destructive"}>
            {getStatusText()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExpanded(!expanded)
              runConnectionTests()
            }}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            {expanded ? 'Hide' : 'Test'}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && results && (
        <CardContent className="space-y-4">
          {/* Environment Variables Status */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Environment Variables
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_URL:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') ? 'default' : 'destructive'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Set'} 
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('ey') ? 'default' : 'destructive'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'} 
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SUPABASE_SERVICE_ROLE_KEY:</span>
                <Badge variant={process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('ey') ? 'default' : 'destructive'}>
                  {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not Set'} 
                </Badge>
              </div>
            </div>
          </div>

          {/* Database Connection */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Connection Details
            </h4>
            <div className="text-sm">
              {results.databaseInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL:</span>
                    <span className="font-mono text-xs">{results.databaseInfo.url}</span>
                  </div>
                  {results.databaseInfo.postsCount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posts in Database:</span>
                      <span>{results.databaseInfo.postsCount}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Schema Status */}
          {results.results && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Schema
              </h4>
              <div className="text-sm space-y-1">
                {Object.entries(results.results).map(([table, result]) => (
                  <div key={table} className="flex justify-between items-center">
                    <span className="text-muted-foreground capitalize">{table}:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={result.exists ? "default" : "destructive"}>
                        {result.exists ? result.count + " records" : "Not Found"}
                      </Badge>
                      {result.error && (
                        <Badge variant="destructive" className="text-xs">
                          {result.error.slice(0, 30)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground mt-2">
                  {results.summary}
                </div>
              </div>
            </div>
          )}

          {/* Storage Status */}
          {results.buckets && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Storage Buckets
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex flex-wrap gap-2">
                  {results.buckets.map(bucket => (
                    <Badge key={bucket} variant="default">
                      {bucket}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300">
              <strong>Error:</strong> {results.error}
              {results.details && <p className="mt-1">{results.details}</p>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => runConnectionTests()}
              variant="outline"
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Test Again
            </Button>
            
            {showDetails && (
              <Button
                onClick={() => window.location.href = 'https://supabase.com/dashboard'}
                variant="outline"
                className="flex-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Supabase Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
