import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { useToast } from '@/hooks/use-toast'

interface ResumeUploadProps {
    onUpload: (url: string) => void
    onRemove?: () => void
    currentFile?: string
    className?: string
    label?: string
}

export const ResumeUpload = ({ onUpload, onRemove, currentFile, className, label = 'Resume File' }: ResumeUploadProps) => {
    const [uploading, setUploading] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    // Extract display name: prefer filename param encoded in URL, then fall back to raw file.name state
    const getDisplayName = (): string | null => {
        if (fileName) return fileName;
        if (!currentFile) return null;
        try {
            const parsed = new URL(currentFile);
            const encoded = parsed.searchParams.get('filename');
            if (encoded) return decodeURIComponent(encoded);
        } catch { /* not a full URL */ }
        // Legacy fallback: extract last path segment (avoids showing raw query string)
        const lastSegment = currentFile.split('/').pop()?.split('?')[0];
        return lastSegment || null;
    };
    const displayName = getDisplayName();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type - allow images and PDFs
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: 'Invalid file type',
                description: 'Please select an image (JPG, PNG, WebP, GIF) or PDF file',
                variant: 'destructive'
            })
            return
        }

        // Validate file size (10MB limit for resume)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Please select a file smaller than 10MB',
                variant: 'destructive'
            })
            return
        }

        setFileName(file.name)
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

            // Build URL using the dedicated /downloadByStorageId endpoint.
            // Encode the original filename so the display and download both use the real name.
            const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL || 'https://careful-wildcat-190.convex.site'
            const publicUrl = `${siteUrl}/downloadByStorageId?storageId=${storageId}&filename=${encodeURIComponent(file.name)}`

            onUpload(publicUrl)
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: 'Upload failed',
                description: 'Failed to upload file. Please try again.',
                variant: 'destructive'
            })
            setFileName(null)
        } finally {
            setUploading(false)
        }
    }

    const removeFile = () => {
        setFileName(null)
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
            <Label className="text-sm font-medium text-gray-200">{label}</Label>

            <Card className="mt-2 bg-navy-900/50 border-navy-600">
                <CardContent className="p-4">
                    {displayName ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700">
                                <FileText className="w-8 h-8 text-purple-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium truncate">{displayName}</p>
                                    <p className="text-xs text-gray-500">Uploaded file</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={removeFile}
                                    disabled={uploading}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={triggerFileInput}
                                disabled={uploading}
                                className="w-full h-9 text-sm bg-transparent border-navy-600 text-white hover:bg-navy-700"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Change File
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <FileText className="w-10 h-10 mx-auto text-gray-500 mb-3" />
                            <p className="text-sm text-gray-400 mb-3">
                                No file selected
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={triggerFileInput}
                                disabled={uploading}
                                className="w-full h-9 text-sm bg-transparent border-navy-600 text-white hover:bg-navy-700"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload File
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <p className="text-xs text-gray-500 mt-3">
                        Supported formats: JPG, PNG, WebP, GIF, PDF. Max size: 10MB
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
