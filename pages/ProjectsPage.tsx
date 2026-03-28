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
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProjectForm } from '../components/Projects/ProjectForm'
import { ProjectList } from '../components/Projects/ProjectList'
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects'
import { useToast } from '@/hooks/use-toast'
import { Project } from '../types'
import { calculatePagination } from '../utils'

export const ProjectsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const itemsPerPage = 10
  
  const { data: projectsData, isLoading } = useProjects(currentPage, itemsPerPage)
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  const { toast } = useToast()
  
  const projects = projectsData?.data || []
  const totalPages = Math.ceil((projectsData?.count || 0) / itemsPerPage)

  const handleSubmit = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, ...data })
        toast({
          title: 'Success',
          description: 'Project updated successfully'
        })
      } else {
        await createProject.mutateAsync(data)
        toast({
          title: 'Success',
          description: 'Project created successfully'
        })
      }
      setIsDialogOpen(false)
      setEditingProject(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id)
      toast({
        title: 'Success',
        description: 'Project deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
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
          <h1 className="text-3xl font-bold text-white">Projects Management</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProject(null) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-navy-800 border-navy-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
              <DialogDescription>
                {editingProject ? 'Update project details' : 'Create a new project for your portfolio'}
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={createProject.isPending || updateProject.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProjectList
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="hover:bg-primary/10 hover:border-primary/30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {calculatePagination(currentPage, totalPages).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={isLoading}
                className={page === currentPage ? "bg-primary" : "hover:bg-primary/10 hover:border-primary/30"}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="hover:bg-primary/10 hover:border-primary/30"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

