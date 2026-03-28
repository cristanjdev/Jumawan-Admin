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
import { WorkExperienceForm } from '@/components/admin/WorkExperience/WorkExperienceForm'
import { WorkExperienceList } from '@/components/admin/WorkExperience/WorkExperienceList'
import { useWorkExperiences, useCreateWorkExperience, useUpdateWorkExperience, useDeleteWorkExperience } from '@/hooks/useWorkExperience'
import { useToast } from '@/hooks/use-toast'
import { WorkExperience } from '@/lib/types'

export const WorkExperiencePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null)
  
  const { data: experiencesData, isLoading } = useWorkExperiences(1, 50)
  const createExperience = useCreateWorkExperience()
  const updateExperience = useUpdateWorkExperience()
  const deleteExperience = useDeleteWorkExperience()
  const { toast } = useToast()
  
  const experiences = experiencesData?.data || []

  const handleSubmit = async (data: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingExperience) {
        await updateExperience.mutateAsync({ id: editingExperience.id, ...data })
        toast({
          title: 'Success',
          description: 'Work experience updated successfully'
        })
      } else {
        await createExperience.mutateAsync(data)
        toast({
          title: 'Success',
          description: 'Work experience created successfully'
        })
      }
      setIsDialogOpen(false)
      setEditingExperience(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save work experience',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (experience: WorkExperience) => {
    setEditingExperience(experience)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience.mutateAsync(id)
      toast({
        title: 'Success',
        description: 'Work experience deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete work experience',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingExperience(null)
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
          <h1 className="text-3xl font-bold text-white">Work Experience Management</h1>
          <p className="text-muted-foreground">Manage your work experience entries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingExperience(null) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-navy-800 border-navy-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingExperience ? 'Edit Work Experience' : 'Add New Work Experience'}
              </DialogTitle>
              <DialogDescription>
                {editingExperience ? 'Update work experience details' : 'Create a new work experience entry'}
              </DialogDescription>
            </DialogHeader>
            <WorkExperienceForm
              experience={editingExperience}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createExperience.isPending || updateExperience.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <WorkExperienceList
        experiences={experiences}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

