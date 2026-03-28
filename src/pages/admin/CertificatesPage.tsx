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
import { CertificateForm } from '@/components/admin/Certificates/CertificateForm'
import { CertificateList } from '@/components/admin/Certificates/CertificateList'
import { useCertificates, useCreateCertificate, useUpdateCertificate, useDeleteCertificate } from '@/hooks/useCertificates'
import { useToast } from '@/hooks/use-toast'
import { Certificate } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const CertificatesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [activeTab, setActiveTab] = useState<'participation' | 'recognition'>('participation')

  const { data: certificatesData, isLoading } = useCertificates(1, 100) // Increased limit to ensure we get all for filtering client-side for now
  const createCertificate = useCreateCertificate()
  const updateCertificate = useUpdateCertificate()
  const deleteCertificate = useDeleteCertificate()
  const { toast } = useToast()

  const certificates = certificatesData || []

  const filteredCertificates = certificates.filter(cert => {
    // If certificate has no type, default to 'participation' for backward compatibility
    const certType = cert.type || 'participation'
    return certType === activeTab
  })

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
              isLoading={createCertificate.isLoading || updateCertificate.isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="participation" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="bg-navy-800 border border-navy-700">
          <TabsTrigger value="participation" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
            Participation
          </TabsTrigger>
          <TabsTrigger value="recognition" className="data-[state=active]:bg-navy-700 data-[state=active]:text-white">
            Recognition
          </TabsTrigger>
        </TabsList>
        <TabsContent value="participation" className="mt-6">
          <CertificateList
            certificates={filteredCertificates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="recognition" className="mt-6">
          <CertificateList
            certificates={filteredCertificates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

