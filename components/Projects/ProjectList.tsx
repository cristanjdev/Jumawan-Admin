import { ProjectCard } from './ProjectCard'
import { Project } from '../../types'
import { FolderOpen } from 'lucide-react'

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

export const ProjectList = ({ projects, onEdit, onDelete }: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
        <p className="text-muted-foreground">Get started by creating your first project</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

