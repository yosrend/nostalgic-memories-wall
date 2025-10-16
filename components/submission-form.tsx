"use client"

import { useState, useRef, React } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { SocialConnectModal } from "@/components/social-connect-modal"
import { Loader2, Upload, Image as ImageIcon, Eye, EyeOff } from "lucide-react"

const submissionSchema = z.object({
  content: z.string().min(1, "Please write something about your memory").max(500, "Memory must be less than 500 characters"),
  name: z.string().optional(),
  isAnonymous: z.boolean(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    threads: z.string().optional(),
    x: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional()
})

type SubmissionForm = z.infer<typeof submissionSchema>

interface SubmissionFormProps {
  onSubmit: (data: FormData) => Promise<{ success: boolean; error?: string; message?: string }>
  isSubmitting: boolean
}

export function SubmissionForm({ onSubmit, isSubmitting }: SubmissionFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSocialLinks, setShowSocialLinks] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      content: "",
      name: "",
      isAnonymous: false,
      socialLinks: {
        instagram: "",
        facebook: "",
        threads: "",
        x: "",
        whatsapp: ""
      }
    },
  })

  const watchContent = form.watch("content")
  const watchIsAnonymous = form.watch("isAnonymous")
  const watchSocialLinks = form.watch("socialLinks")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size and type
      if (file.size > 5 * 1024 * 1024) { // 5MB
        form.setError("root", { message: "Image size must be less than 5MB" })
        return
      }
      
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        form.setError("root", { message: "Only JPEG and PNG images are allowed" })
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (data: SubmissionForm) => {
    form.clearErrors()
    
    const formData = new FormData()
    formData.append('content', data.content)
    formData.append('name', data.isAnonymous ? '' : (data.name || 'Anonymous'))
    formData.append('isAnonymous', data.isAnonymous.toString())
    formData.append('socialLinks', JSON.stringify(showSocialLinks ? data.socialLinks : {}))
    
    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0])
    }

    const result = await onSubmit(formData)
    
    if (result.success) {
      form.reset()
      setImagePreview(null)
      setShowSocialLinks(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } else {
      form.setError("root", { message: result.error })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Share Your Memory
        </CardTitle>
        <CardDescription>
          Share a special memory with our community. Your submission will be reviewed before appearing on the wall.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}

            {/* Memory Text */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Memory *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share a memory, story, or message..."
                      value={field.value}
                      onChange={field.onChange}
                      className="min-h-[100px] resize-none"
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <FormMessage />
                    <span>{500 - (watchContent?.length || 0)} characters remaining</span>
                  </div>
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Memory Image (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Memory preview"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="gap-2"
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image here, or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG up to 5MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress value={uploadProgress} className="w-full" />
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Submit Anonymously</FormLabel>
                      <FormDescription>
                        Your name won&apos;t be displayed with this memory
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Name Field */}
            {!watchIsAnonymous && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name as you'd like it to appear"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Social Links */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSocialLinks(!showSocialLinks)}
                className="w-full gap-2"
              >
                {showSocialLinks ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSocialLinks ? 'Hide' : 'Show'} Social Media Links (Optional)
              </Button>
              
              {showSocialLinks && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@username"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Facebook profile"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.threads"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threads</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@username"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X (Twitter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@username"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinks.whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !watchContent?.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Share Memory"
              )}
            </Button>
          </form>
        </Form>

      {/* Social Connect Option */}
      <div className="text-center mt-4">
        <SocialConnectModal
          trigger={<Button variant="link" className="text-xs text-amber-600 dark:text-amber-400">Add your social profiles</Button>}
        />
      </div>

        {/* Success Message */}
        {!form.formState.errors.root && !isSubmitting && (
          <Card className="mt-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Almost Ready!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Share your social profiles so classmates can connect with you after the reunion.
                </p>
                <div className="flex items-center gap-2 text-sm mt-3">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="text-green-800 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-600"
                    onClick={() => {
                      form.reset()
                      setImagePreview(null)
                      setShowSocialLinks(false)
                    }}
                  >
                    Share Another Memory
                  </Button> 
                </div> 
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
