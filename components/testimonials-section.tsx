"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Ahmad Rizki",
    role: "Community Manager",
    content: "MAHWA 2006 Agent has transformed our daily operations. Memory management that once consumed hours now complete in moments, freeing our team to focus on creativity and community growth.",
    rating: 5,
    avatar: "AR"
  },
  {
    name: "Siti Nurjanah",
    role: "Event Coordinator",
    content: "Implementing the AI-powered memory validation model has drastically improved our community engagement. Seeing a 50% increase in participation! Highly recommend this system.",
    rating: 5,
    avatar: "SN"
  },
  {
    name: "Budi Santoso",
    role: "Alumni Relations",
    content: "As a community, we need to move fast and stay connected. The automated memory assistant helps us do just that. Our engagement speed has doubled. Essential tool for any alumni community.",
    rating: 5,
    avatar: "BS"
  },
  {
    name: "Diana Putri",
    role: "Student Representative",
    content: "The AI-driven analytics from MAHWA 2006 have revolutionized our community development cycle. Insights are now more accurate and faster than ever. A game-changer for education communities.",
    rating: 5,
    avatar: "DP"
  },
  {
    name: "Eko Prasetyo",
    role: "Alumni Network Admin",
    content: "#MAHWA2006Agent's AI-driven memory curation has made managing our alumni network a breeze. Community engagement is now seamless and efficient. A must-have for any alumni network.",
    rating: 5,
    avatar: "EP"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-t from-muted/30 to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Fast-Growing Communities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how MAHWA 2006 Agent is transforming communities nationwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-card to-muted border hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-lg font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Quote className="h-4 w-4 text-blue-500 mb-3 opacity-50" />
                  
                  <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="text-sm text-gray-500 italic mt-2">
                    {testimonial.name} • {testimonial.role}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Automate. Simplify. Thrive.
              </span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start your 30-day free trial today. Cancel anytime, no questions asked.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                Start Free Trial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
