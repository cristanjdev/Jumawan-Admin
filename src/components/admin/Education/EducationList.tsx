import { Education } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, GraduationCap } from 'lucide-react'

interface EducationListProps {
  education: Education[]
  onEdit: (education: Education) => void
  onDelete: (id: string) => void
}

export const EducationList = ({ education, onEdit, onDelete }: EducationListProps) => (
  <div className="space-y-4">
    {education.map((edu) => (
      <Card key={edu.id} className="bg-navy-800 border-navy-700 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 gap-4">
            {edu.image_url ? (
              <img src={edu.image_url} alt="" className="h-16 w-24 shrink-0 rounded-md object-cover" />
            ) : (
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-navy-700">
                <GraduationCap className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
              <p className="text-primary font-medium">{edu.school}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{edu.period}</span>
                <Badge variant="secondary" className="text-xs">{edu.level}</Badge>
                {!edu.image_url && <span className="text-amber-400">No image yet</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(edu)} className="h-8" aria-label="Edit"><Edit className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(edu.id)} className="h-8 text-red-400 hover:text-red-300" aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>
    ))}
  </div>
)
