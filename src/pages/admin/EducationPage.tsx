import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GraduationCap, Plus } from 'lucide-react'
import { EducationForm } from '@/components/admin/Education/EducationForm'
import { EducationList } from '@/components/admin/Education/EducationList'
import { useEducation } from '@/hooks/useEducation'
import { useToast } from '@/hooks/use-toast'
import { CreateEducationInput, Education } from '@/lib/types'

/** The entries the portfolio shows today; "Import current entries" copies them into the database so they can be edited here */
const CURRENT_ENTRIES: CreateEducationInput[] = [
  {
    degree: 'Bachelor of Science in Information Technology',
    level: "Bachelor's degree",
    school: 'Liceo de Cagayan University',
    location: 'Cagayan de Oro, Misamis Oriental',
    period: '2022 – 2026',
    gpa: '',
    status: 'Graduated',
    honors: 'With Honors',
    description:
      'Four-year degree covering software development, database systems, web and mobile applications, and systems analysis. Graduated with honors and was recognized as an Outstanding Intern.',
    coursework: [
      'Software Development',
      'Database Management Systems',
      'Web Technologies',
      'Mobile Application Development',
      'System Analysis & Design',
      'Network Administration',
    ],
    achievements: [
      { title: 'Outstanding Intern', detail: '2026', group: 'Recognition' },
      { title: "Consistent Dean's Lister", detail: '8 semesters', group: 'Recognition' },
      { title: 'TOPCIT Exam – Level 3', detail: '2025', group: 'Recognition' },
      { title: 'TOPCIT Exam – Level 2', detail: '2024', group: 'Recognition' },
      { title: 'Vice President, Wizardry Society', detail: '2025 – 2026', group: 'Leadership & activities' },
      { title: 'President, Wizardry Society', detail: '2024 – 2025', group: 'Leadership & activities' },
      { title: 'Participant, Hack4Gov', detail: '2024', group: 'Leadership & activities' },
    ],
    order_index: 0,
  },
  {
    degree: 'Information Communication Technology (ICT) Strand',
    level: 'Senior high school',
    school: 'Liceo de Cagayan University',
    location: 'Cagayan de Oro, Misamis Oriental',
    period: '2020 – 2022',
    gpa: '',
    status: 'Graduated',
    description:
      'My first formal introduction to technology. The ICT track covered how computers and networks work, programming logic and the basics of code, building and styling web pages, and working with databases. It gave me the foundation for the BSIT degree that followed.',
    coursework: ['Computer Programming', 'Programming Logic', 'Web Development (HTML, CSS)', 'Database Fundamentals', 'Networking Basics', 'Computer Systems Servicing', 'Empowerment Technologies', 'Digital Design', 'Work Immersion'],
    achievements: [],
    order_index: 1,
  },
]

export const EducationPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Education | null>(null)
  const [saving, setSaving] = useState(false)
  const { education, isLoading, create, update, remove } = useEducation()
  const { toast } = useToast()

  const fail = (description: string) => toast({ title: 'Error', description, variant: 'destructive' })

  const close = () => {
    setIsDialogOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (data: CreateEducationInput) => {
    setSaving(true)
    try {
      if (editing) await update({ id: editing.id, ...data })
      else await create(data)
      toast({ title: 'Success', description: `Education ${editing ? 'updated' : 'created'} successfully` })
      close()
    } catch {
      fail('Failed to save education')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await remove(id)
      toast({ title: 'Success', description: 'Education deleted successfully' })
    } catch {
      fail('Failed to delete education')
    }
  }

  const importCurrent = async () => {
    setSaving(true)
    try {
      for (const entry of CURRENT_ENTRIES) await create(entry)
      toast({ title: 'Success', description: 'Current entries imported. You can now edit them and add images.' })
    } catch {
      fail('Failed to import the current entries')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading && education.length === 0) {
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
          <h1 className="text-3xl font-bold text-white">Education Management</h1>
          <p className="text-muted-foreground">Manage your education entries and their images</p>
        </div>
        <Button onClick={() => { setEditing(null); setIsDialogOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No education in the database yet</h3>
          <p className="text-muted-foreground mb-4">
            The portfolio is showing its built-in entries. Import them to edit them here and attach images.
          </p>
          <Button onClick={importCurrent} disabled={saving}>{saving ? 'Importing…' : 'Import current entries'}</Button>
        </div>
      ) : (
        <EducationList education={education} onEdit={(e) => { setEditing(e); setIsDialogOpen(true) }} onDelete={handleDelete} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : close())}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-navy-800 border-navy-700">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Edit Education' : 'Add New Education'}</DialogTitle>
            <DialogDescription>{editing ? 'Update this entry and its image' : 'Create a new education entry'}</DialogDescription>
          </DialogHeader>
          <EducationForm education={editing} nextOrder={education.length} onSubmit={handleSubmit} onCancel={close} isLoading={saving} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
