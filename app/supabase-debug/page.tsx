import { Suspense } from "react"
import { SupabaseStatus } from "@/components/supabase-status"

export default function SupabaseDebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Database Connection Status
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Check your Supabase database connection and configuration
          </p>
          <div className="inline-flex items-center gap-4 text-sm text-muted-foreground">
            <span>Need to configure Supabase?</span>
            <a 
              href="https://github.com/yrendiz/nostalgic-memories-wall/blob/main/README.md#supabase-setup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 underline"
            >
              View Setup Instructions
            </a>
          </div>
        </div>

        <div className="grid gap-6">
          <Suspense fallback={
            <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 border-t-transparent"></div>
            </div>
          }>
            <SupabaseStatus showDetails={true} />
          </Suspense>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-900 dark:text-amber-100">Quick Setup</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded">
                  <span>1. Create Supabase Project</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded">
                  <span>2. Update Environment Variables</span>
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded">
                  <span>3. Run Database Schema</span>
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-900 dark:text-amber-100">Environment Variables</h3>
              <div className="space-y-3 text-sm font-mono">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="text-gray-600 dark:text-gray-400">{`NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}`}</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="text-gray-600 dark:text-gray-400 truncate">{`NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20)}...`}</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="text-gray-600 dark:text-gray-400">{`SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20)}...`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-amber-900 dark:text-amber-100">Setup Instructions</h3>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="font-semibold flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
              <div>
                <p className="mb-1">Create a free Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">supabase.com</a></p>
                <p className="text-muted-foreground">Choose any region and name your project</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
              <div>
                <p className="mb-1">Copy the Project URL and API Keys</p>
                <p className="text-muted-foreground">Go to Project Settings → API to get your keys</p>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                  <div className="text-gray-600 dark:text-gray-400">{`URL: https://your-project-ref.supabase.co`}</div>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
              <div>
                <p className="mb-1">Update Environment Variables</p>
                <p className="text-muted-foreground">Replace placeholder values in .env file with your actual keys</p>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  <div className="text-gray-600 dark:text-gray-400">{`NEXT_PUBLIC_SUPABASE_URL=https://project-ref.supabase.co`}</div>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-semibold flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
              <div>
                <p className="mb-1">Create Database Tables</p>
                <p className="text-muted-foreground">Run the schema query or use the SQL editor in Supabase</p>
                <a href="https://github.com/yrendiz/nostalgic-memories-wall/blob/main/lib/supabase/schema.sql" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  View Schema File →
                </a>
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/'} 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            Return to Memory Wall
          </Button>
        </div>
      </div>
    </div>
  )
}
