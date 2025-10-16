"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Shield, Users, Clock, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Smart Automation",
    description: "Set it, forget it. Our AI system handles repetitive memory management tasks so you can focus on strategy, innovation, and community growth.",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Experience real-time assistance for memory coordination, automatic validation, and seamless team alignment in the MAHWA 2006 community.",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Safeguard your memories with enterprise-grade encryption and secure access controls. Your data privacy is our top priority.",
    gradient: "from-green-600 to-emerald-600"
  },
  {
    icon: Sparkles,
    title: "Instant Insights",
    description: "Transform memory data into meaningful community insights. Empower smarter decisions with always-learning intelligence.",
    gradient: "from-amber-600 to-orange-600"
  },
  {
    icon: Clock,
    title: "Time-Saving Workflow",
    description: "Tasks that once consumed hours now complete in moments. Streamline your memory management process dramatically.",
    gradient: "from-indigo-600 to-purple-600"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process and validate memory submissions instantly with our optimized AI engine. No more waiting for manual approvals.",
    gradient: "from-red-600 to-pink-600"
  }
]

export function FeatureSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Empower Your Community with AI
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ask our AI Agent for real-time collaboration, seamless integrations, and actionable insights to streamline your MAHWA 2006 community operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
