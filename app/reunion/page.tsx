"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ThemeProvider } from "@/components/theme-provider"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  Camera,
  Music,
  Sparkles,
  Heart
} from "lucide-react"
import Image from "next/image"

// Reunion photos data
const reunionPhotos = [
  {
    id: 1,
    url: "/api/placeholder/400/300",
    title: "Group Photo 2024",
    description: "All alumni gathered for the annual reunion"
  },
  {
    id: 2,
    url: "/api/placeholder/400/300",
    title: "Memorable Moments",
    description: "Flashback memories from our school days"
  },
  {
    id: 3,
    url: "/api/placeholder/400/300",
    title: "Class of Memories",
    description: "Throwback to our graduation day"
  },
  {
    id: 4,
    url: "/api/placeholder/400/300",
    title: "Friendship Forever",
    description: "Best friends reunited after years"
  }
]

// FAQ data
const faqData = [
  {
    question: "When is the reunion event?",
    answer: "The reunion is scheduled for Saturday, December 15, 2024, starting at 6:00 PM."
  },
  {
    question: "Where will the event be held?",
    answer: "The reunion will take place at the Grand Ballroom, Downtown Convention Center, 123 Main Street."
  },
  {
    question: "What should I wear?",
    answer: "Semi-formal attire is recommended. Come prepared for photos and dancing!"
  },
  {
    question: "Can I bring guests?",
    answer: "Yes, you're welcome to bring one guest. Please include their information in your RSVP."
  },
  {
    question: "Is parking available?",
    answer: "Yes, complimentary valet parking is available for all attendees."
  },
  {
    question: "Will there be food and drinks?",
    answer: "A full dinner and open bar will be provided throughout the evening."
  }
]

// Alumni groups data
const alumniGroups = [
  {
    id: 1,
    name: "Class of 2010-2014",
    description: "Get ready to reminisce about the good old days!",
    link: "https://facebook.com/groups/2010-2014",
    icon: Users
  },
  {
    id: 2,
    name: "Alumni Network",
    description: "Connect with fellow graduates from all years!",
    link: "https://linkedin.com/groups/alumni",
    icon: Globe
  },
  {
    id: 3,
    name: "Reunion Committee",
    description: "Help us make future reunions even better!",
    link: "mailto:reunion@example.com",
    icon: Heart
  }
]

export default function ReunionPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [expandedQa, setExpandedQa] = useState<string | undefined>(undefined)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-orange-900/20" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl"
              >
                🎓
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Annual Reunion 2024
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Relive memories, reconnect with friends, and create new moments that will last a lifetime.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2">
                <Calendar className="h-5 w-5" />
                RSVP Now
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Share Details
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Event Details */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Event Details
                </span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardHeader className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <CardTitle className="text-lg">Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="font-semibold">December 15, 2024</p>
                    <p className="text-muted-foreground">6:00 PM - 11:59 PM</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardHeader className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="font-semibold">Grand Ballroom</p>
                    <p className="text-muted-foreground">Downtown Convention Center</p>
                    <p className="text-sm text-muted-foreground">123 Main Street</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardHeader className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <CardTitle className="text-lg">Attendees</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="font-semibold text-2xl">250+</p>
                    <p className="text-muted-foreground">Expected Guests</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardHeader className="text-center">
                    <Music className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <CardTitle className="text-lg">Entertainment</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="font-semibold">Live Band</p>
                    <p className="text-muted-foreground">DJ & Dancing</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Find Us Here
                </span>
              </h2>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                      <h3 className="text-xl font-semibold mb-2">Downtown Convention Center</h3>
                      <p className="text-muted-foreground mb-4">123 Main Street, City, State 12345</p>
                      <Button variant="outline" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Open in Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Memory Lane Gallery
                </span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reunionPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedPhoto(photo.id)}
                  >
                    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
                      <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 relative">
                        <Camera className="absolute inset-0 m-auto w-16 h-16 text-amber-400/30" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm">{photo.title}</h3>
                        <p className="text-xs text-muted-foreground">{photo.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <AccordionItem 
                      value={`item-${index}`}
                      className="bg-white/80 backdrop-blur-sm border-amber-200"
                    >
                      <AccordionTrigger className="text-left hover:text-amber-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Stay Connected
                </span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                    <CardTitle className="text-lg mb-2">Email</CardTitle>
                    <p className="text-sm text-muted-foreground">reunion@example.com</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                    <CardTitle className="text-lg mb-2">Phone</CardTitle>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                  <CardContent className="p-6 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                    <CardTitle className="text-lg mb-2">Website</CardTitle>
                    <p className="text-sm text-muted-foreground">www.reunion2024.com</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer with Links */}
        <footer className="py-12 px-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
          <div className="container mx-auto text-center">
            <h3 className="text-xl font-semibold mb-6">Join Our Alumni Groups</h3>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {alumniGroups.map((group) => (
                <Button
                  key={group.id}
                  variant="outline"
                  className="gap-2 bg-white/80 hover:bg-white"
                  asChild
                >
                  <a href={group.link} target="_blank" rel="noopener noreferrer">
                    <group.icon className="h-4 w-4" />
                    {group.name}
                  </a>
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Alumni Reunion. All rights reserved. Made with <Heart className="inline h-4 w-4 text-red-500" />
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
