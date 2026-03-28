import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/FileUpload'
import { Certificate, CertificateFormData } from '../../types'

interface CertificateFormProps {
  certificate?: Certificate | null
  onSubmit: (data: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const CertificateForm = ({ certificate, onSubmit, onCancel, isLoading }: CertificateFormProps) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    title: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    image_url: '',
    description: '',
    order_index: 0
  })

  useEffect(() => {
    if (certificate) {
      setFormData({
        title: certificate.title,
        issuer: certificate.issuer,
        issue_date: certificate.issue_date,
        credential_id: certificate.credential_id || '',
        credential_url: certificate.credential_url || '',
        image_url: certificate.image_url || '',
        description: certificate.description || '',
        order_index: certificate.order_index
      })
    }
  }, [certificate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white text-sm font-medium">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Certificate title"
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuer" className="text-white text-sm font-medium">Issuer *</Label>
          <Input
            id="issuer"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            placeholder="Issuing organization"
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_index" className="text-white text-sm font-medium">Order Index</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            placeholder="Display order"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue_date" className="text-white text-sm font-medium">Issue Date *</Label>
          <Input
            id="issue_date"
            type="date"
            value={formData.issue_date}
            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credential_id" className="text-white text-sm font-medium">Credential ID</Label>
          <Input
            id="credential_id"
            value={formData.credential_id}
            onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
            placeholder="Certificate ID or verification code"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credential_url" className="text-white text-sm font-medium">Verification URL</Label>
          <Input
            id="credential_url"
            value={formData.credential_url}
            onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
            placeholder="URL to verify certificate"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Certificate description"
          className="bg-navy-700 border-navy-600 text-white"
          rows={3}
        />
      </div>

      <FileUpload
        onUpload={(url) => setFormData({ ...formData, image_url: url })}
        currentImage={formData.image_url}
        folder="certificates"
        className="space-y-2"
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-navy-600">
        <Button type="button" variant="outline" onClick={onCancel} className="h-9" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="h-9" disabled={isLoading}>
          {certificate ? 'Update' : 'Create'} Certificate
        </Button>
      </div>
    </form>
  )
}

