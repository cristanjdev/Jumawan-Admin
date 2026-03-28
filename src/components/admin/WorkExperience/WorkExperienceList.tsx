import { WorkExperience } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Briefcase } from 'lucide-react'

interface WorkExperienceListProps {
  experiences: WorkExperience[]
  onEdit: (experience: WorkExperience) => void
  onDelete: (id: string) => void
}

export const WorkExperienceList = ({ experiences, onEdit, onDelete }: WorkExperienceListProps) => {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No work experience yet</h3>
        <p className="text-muted-foreground">Get started by adding your first work experience</p>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <Card key={exp.id} className="bg-navy-800 border-navy-700 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                <Badge variant="secondary" className="text-xs">
                  {exp.type}
                </Badge>
                {exp.current && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-primary font-medium mb-2">{exp.company}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{formatDate(exp.start_date)}</span>
                <span>-</span>
                <span>{exp.current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}</span>
                {exp.location && (
                  <>
                    <span>•</span>
                    <span>{exp.location}</span>
                  </>
                )}
              </div>
              {exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.technologies.slice(0, 5).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {exp.technologies.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{exp.technologies.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(exp)}
                className="h-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(exp.id)}
                className="h-8 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

