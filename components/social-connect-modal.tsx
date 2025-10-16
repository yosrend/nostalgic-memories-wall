"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Instagram,
  Facebook,
  MessageCircle,
  Twitter,
  Phone,
  Share2,
  Plus,
  X
} from "lucide-react"

const socialConnectSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  threads: z.string().optional(),
  x: z.string().optional(),
  whatsapp: z.string().optional(),
})

type SocialConnectForm = z.infer<typeof socialConnectSchema>

interface SocialConnectModalProps {
  children?: React.ReactNode
  onConnect?: (data: SocialConnectForm) => void
  triggerText?: string
}

export function SocialConnectModal({ 
  children, 
  onConnect, 
  triggerText = "Connect Social Profiles" 
}: SocialConnectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<SocialConnectForm>({
    resolver: zodResolver(socialConnectSchema),
    defaultValues: {
      instagram: "",
      facebook: "",
      threads: "",
      x: "",
      whatsapp: "",
    },
  })

  const handleSubmit = async (data: SocialConnectForm) => {
    setIsSubmitting(true)
    try {
      // Call the onConnect callback if provided
      if (onConnect) {
        await onConnect(data)
      }

      toast({
        title: "Social profiles connected!",
        description: "Your social media links have been saved for future reference.",
        variant: "success",
      })

      form.reset()
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to save your social profiles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialPlatforms = [
    {
      name: "instagram",
      label: "Instagram",
      placeholder: "@username",
      icon: Instagram,
      prefix: "@",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      name: "threads",
      label: "Threads",
      placeholder: "@username", 
      icon: MessageCircle,
      prefix: "@",
      color: "bg-black",
    },
    {
      name: "x",
      label: "X (Twitter)",
      placeholder: "@username",
      icon: Twitter,
      prefix: "@",
      color: "bg-black",
    },
    {
      name: "facebook",
      label: "Facebook", 
      placeholder: "username or profile link",
      icon: Facebook,
      prefix: "",
      color: "bg-blue-600",
    },
    {
      name: "whatsapp",
      label: "WhatsApp",
      placeholder: "+1 (555) 123-4567",
      icon: Phone,
      prefix: "",
      color: "bg-green-600",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Connect Social Profiles
          </DialogTitle>
          <DialogDescription>
            Share your social media profiles so classmates can connect with you after the reunion.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <FormField
                    key={platform.name}
                    control={form.control}
                    name={platform.name as keyof SocialConnectForm}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${platform.color} flex items-center justify-center`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          {platform.label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={platform.placeholder}
                            {...field}
                            className="transition-all focus:ring-2 focus:ring-offset-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              })}
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Badge variant="secondary" className="gap-1">
                  <Plus className="h-3 w-3" />
                  Optional
                </Badge>
                <span>Connecting your profiles helps classmates stay in touch</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Connecting..." : "Connect Profiles"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
