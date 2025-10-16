"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SubmissionModal } from "@/components/submission-modal"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Meteors } from "@/components/ui/meteors"
import { Spotlight } from "@/components/ui/spotlight"
import { Share2, Users, Activity, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  postsCount: number
}

export function HeroSection({ postsCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <BackgroundBeams />
        <Meteors number={20} />
        <Spotlight size={800} color="rgba(147, 51, 234, 0.1)" />
      </div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <header className="sticky top-0 z-50 bg-background/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">M2</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MAHWA 2006 Agent
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                  AI-powered memory management & automation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Navigation />
              <ThemeToggle />
              <SubmissionModal>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share Memory</span>
                </Button>
              </SubmissionModal>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="text-center px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Introducing
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">
                  Memory Automation
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                AI-powered system designed to streamline memory management and handle manual tasks, 
                so you can focus on what truly matters in the MAHWA 2006 community.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <SubmissionModal>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Try for Free
                </Button>
              </SubmissionModal>
              
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Activity className="h-4 w-4" />
                <span>{postsCount} memories shared</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Trusted by community</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <Award className="h-4 w-4" />
                <span className="text-sm">AI-powered</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <Users className="h-4 w-4" />
                <span className="text-sm">Real-time updates</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
