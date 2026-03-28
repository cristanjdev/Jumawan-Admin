import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CertificateForm } from '../components/Certificates/CertificateForm'
import { CertificateList } from '../components/Certificates/CertificateList'
import { useCertificates, useCreateCertificate, useUpdateCertificate, useDeleteCertificate } from '../hooks/useCertificates'
import { useToast } from '@/hooks/use-toast'
import { Certificate } from '../types'

export const CertificatesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  
  const { data: certificatesData, isLoading } = useCertificates(1, 50)
  const createCertificate = useCreateCertificate()
  const updateCertificate = useUpdateCertificate()
  const deleteCertificate = useDeleteCertificate()
  const { toast } = useToast()
  
  const certificates = certificatesData?.data || []

  const handleSubmit = async (data: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCertificate) {
        await updateCertificate.mutateAsync({ id: editingCertificate.id, ...data })
        toast({
          title: 'Success',
          description: 'Certificate updated successfully'
        })
      } else {
        await createCertificate.mutateAsync(data)
        toast({
          title: 'Success',
          description: 'Certificate created successfully'
        })
      }
      setIsDialogOpen(false)
      setEditingCertificate(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save certificate',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCertificate.mutateAsync(id)
      toast({
        title: 'Success',
        description: 'Certificate deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete certificate',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingCertificate(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Certificates Management</h1>
          <p className="text-muted-foreground">Manage your certificates and achievements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCertificate(null) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-navy-800 border-navy-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
              </DialogTitle>
              <DialogDescription>
                {editingCertificate ? 'Update certificate details' : 'Add a new certificate or achievement'}
              </DialogDescription>
            </DialogHeader>
            <CertificateForm
              certificate={editingCertificate}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createCertificate.isPending || updateCertificate.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CertificateList
        certificates={certificates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

