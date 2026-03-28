import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Edit, Trash2, ExternalLink, Github, FolderOpen } from 'lucide-react'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Project } from '../../types'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

export const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  return (
    <Card className="bg-navy-800 border-navy-700 hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {project.image_url && (
            <div className="flex-shrink-0">
              <OptimizedImage
                src={project.image_url}
                alt={project.title}
                className="w-20 h-20 object-cover rounded-lg border border-navy-600"
                fallbackIcon={<FolderOpen className="w-8 h-8 text-muted-foreground" />}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <span>Order: {project.order_index}</span>
                  <span>•</span>
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(project)}
                  className="hover:bg-primary/10 hover:border-primary/30"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-500/10 hover:border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-navy-800 border-navy-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to delete "{project.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(project.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              {project.live_url && (
                <Button size="sm" variant="outline" asChild className="hover:bg-primary/10 hover:border-primary/30">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button size="sm" variant="outline" asChild className="hover:bg-primary/10 hover:border-primary/30">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3 mr-1" />
                    Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

