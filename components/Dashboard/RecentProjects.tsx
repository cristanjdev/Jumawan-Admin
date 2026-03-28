import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderOpen } from 'lucide-react'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Project } from '../../types'

interface RecentProjectsProps {
  projects: Project[]
}

export const RecentProjects = ({ projects }: RecentProjectsProps) => {
  return (
    <Card className="bg-navy-800 border-navy-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Projects</CardTitle>
        <CardDescription>Latest portfolio projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No projects yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="group p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-all duration-200 border border-navy-600 hover:border-primary/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      {project.featured && (
                        <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 4).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          +{project.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Order: {project.order_index}</span>
                      <span>•</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {project.image_url && (
                    <div className="ml-4 flex-shrink-0">
                      <OptimizedImage
                        src={project.image_url}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-lg border border-navy-600 group-hover:border-primary/30 transition-colors"
                        fallbackIcon={<FolderOpen className="w-6 h-6 text-muted-foreground" />}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

