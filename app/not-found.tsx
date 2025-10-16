"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Sparkles,
  Heart
} from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Animated Icon */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0], 
                scale: [1, 1.05, 1.05, 1] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center"
            >
              <Search className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Oops! Memory Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The memory you're looking for seems to have gotten lost in time. 
                Let's get you back to the main wall!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Link href="/" className="block">
                <Button className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  <Home className="h-4 w-4" />
                  Return to Memory Wall
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </motion.div>

            {/* Friendly Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Every memory is special. Let's find the right one together!
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Floating decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-10 text-4xl opacity-20"
          >
            📸
          </motion.div>
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-10 text-4xl opacity-20"
          >
            ✨
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
