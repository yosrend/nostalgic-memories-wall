"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SubmissionForm } from "./submission-form"
import { submitMemory } from "@/lib/actions/submit-memory"

interface SubmissionModalProps {
  children?: React.ReactNode
  onSuccessfulSubmit?: (post: any) => void
}

export function SubmissionModal({ children, onSuccessfulSubmit }: SubmissionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsSubmitting(true)
    setResult(null)
    
    try {
      const response = await submitMemory(formData)
      
      if (response.success) {
        toast({
          title: "Memory submitted successfully! ✨",
          description: response.message || "Your memory is now visible on the wall!",
          variant: "success",
        })
        
        // Call immediate update callback to bypass cache delay
        if (onSuccessfulSubmit && response.post) {
          onSuccessfulSubmit(response.post)
        }
        
        // Close modal after success
        setTimeout(() => {
          setIsOpen(false)
          setResult(null)
        }, 1500)
        
        return response
      } else {
        toast({
          title: "Submission failed",
          description: response.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
        
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred"
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      })
      
      return { success: false, error: errorMessage }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setResult(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg md:h-16 md:w-16 gap-2">
            <Plus className="h-5 w-5" />
            <span className="hidden md:inline">Share Memory</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Memory</DialogTitle>
          <DialogDescription>
            Add your special memory to our wall. All submissions are reviewed before being published.
          </DialogDescription>
        </DialogHeader>
        
        {result?.success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
        
        {result?.success === false && (
          <Alert variant="destructive">
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
        
        {!result && (
          <SubmissionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </DialogContent>
    </Dialog>
  )
}
