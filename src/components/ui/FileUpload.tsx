import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { useToast } from '@/hooks/use-toast'

interface FileUploadProps {
  onUpload: (url: string) => void
  onRemove?: () => void
  currentImage?: string
  folder: 'projects' | 'experience' | 'education' | 'certificates' | 'profile' | 'tools' | 'hero' | 'about'
  className?: string
}

export const FileUpload = ({ onUpload, onRemove, currentImage, folder, className }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Sync preview when currentImage changes (e.g. when editing populates the form)
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage)
    }
  }, [currentImage])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (15MB for hero/profile avatar, 5MB for others)
    const maxSize = folder === 'hero' ? 15 * 1024 * 1024 : 5 * 1024 * 1024
    const maxLabel = folder === 'hero' ? '15MB' : '5MB'
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `Please select an image smaller than ${maxLabel}`,
        variant: 'destructive'
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)

      // Get upload URL from Convex
      const uploadUrl = await convexClient.mutation(api.files.generateUploadUrl, {})

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!result.ok) throw new Error('Upload failed')

      const { storageId } = await result.json()

      // Construct the public URL via Convex HTTP endpoint
      const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL || 'https://careful-wildcat-190.convex.site'
      const publicUrl = `${siteUrl}/getImage?storageId=${storageId}`

      onUpload(publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      })
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onRemove) {
      onRemove()
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium">Image</Label>

      <Card className="mt-2">
        <CardContent className="p-3">
          {preview ? (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={removeImage}
                  disabled={uploading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="flex-1 h-8 text-xs"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 mr-1" />
                      Change Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-xs text-muted-foreground mb-3">
                No image selected
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={uploading}
                className="w-full h-8 text-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPG, PNG, GIF, WebP. Max size: {folder === 'hero' ? '15MB' : '5MB'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

