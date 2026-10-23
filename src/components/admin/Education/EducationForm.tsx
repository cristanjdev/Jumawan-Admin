import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/components/ui/FileUpload'
import { Education, EducationAchievement } from '@/lib/types'
import { Plus, X } from 'lucide-react'

type FormData = Omit<Education, 'id' | 'created_at' | 'updated_at'>

const EMPTY: FormData = {
  degree: '',
  level: '',
  school: '',
  location: '',
  period: '',
  gpa: '',
  status: 'Graduated',
  honors: '',
  description: '',
  coursework: [],
  achievements: [],
  image_url: '',
  order_index: 0,
}

interface EducationFormProps {
  education?: Education | null
  /** Next free position in the list, used for new entries */
  nextOrder: number
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const field = 'bg-navy-700 border-navy-600 text-white h-9'

export const EducationForm = ({ education, nextOrder, onSubmit, onCancel, isLoading }: EducationFormProps) => {
  const [formData, setFormData] = useState<FormData>({ ...EMPTY, order_index: nextOrder })
  const [courseInput, setCourseInput] = useState('')
  const [achTitle, setAchTitle] = useState('')
  const [achDetail, setAchDetail] = useState('')
  const [achGroup, setAchGroup] = useState<EducationAchievement['group']>('Recognition')

  useEffect(() => {
    if (education) {
      // Pick the editable fields only; the stored document also carries _id, _creationTime and id,
      // which the update mutation rejects
      setFormData({
        degree: education.degree,
        level: education.level,
        school: education.school,
        location: education.location,
        period: education.period,
        gpa: education.gpa,
        status: education.status,
        honors: education.honors ?? '',
        description: education.description,
        coursework: education.coursework,
        achievements: education.achievements,
        image_url: education.image_url ?? '',
        order_index: education.order_index,
      })
    } else {
      setFormData({ ...EMPTY, order_index: nextOrder })
    }
  }, [education, nextOrder])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => setFormData((f) => ({ ...f, [key]: value }))

  const addCourse = () => {
    const value = courseInput.trim()
    if (value && !formData.coursework.includes(value)) set('coursework', [...formData.coursework, value])
    setCourseInput('')
  }

  const addAchievement = () => {
    const title = achTitle.trim()
    if (!title) return
    set('achievements', [...formData.achievements, { title, detail: achDetail.trim() || undefined, group: achGroup }])
    setAchTitle('')
    setAchDetail('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ ...formData, honors: formData.honors?.trim() || undefined, image_url: formData.image_url || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="degree" className="text-white text-sm font-medium">Degree / Program *</Label>
          <Input id="degree" required value={formData.degree} onChange={(e) => set('degree', e.target.value)} className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school" className="text-white text-sm font-medium">School *</Label>
          <Input id="school" required value={formData.school} onChange={(e) => set('school', e.target.value)} className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level" className="text-white text-sm font-medium">Level *</Label>
          <Input id="level" required value={formData.level} onChange={(e) => set('level', e.target.value)} placeholder="e.g., Bachelor's degree" className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period" className="text-white text-sm font-medium">Years attended *</Label>
          <Input id="period" required value={formData.period} onChange={(e) => set('period', e.target.value)} placeholder="e.g., 2022 – 2026" className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-white text-sm font-medium">Location</Label>
          <Input id="location" value={formData.location} onChange={(e) => set('location', e.target.value)} className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-white text-sm font-medium">Status</Label>
          <Input id="status" value={formData.status} onChange={(e) => set('status', e.target.value)} placeholder="e.g., Graduated" className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="honors" className="text-white text-sm font-medium">Honors</Label>
          <Input id="honors" value={formData.honors ?? ''} onChange={(e) => set('honors', e.target.value)} placeholder="e.g., With Honors" className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpa" className="text-white text-sm font-medium">GPA</Label>
          <Input id="gpa" value={formData.gpa} onChange={(e) => set('gpa', e.target.value)} className={field} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_index" className="text-white text-sm font-medium">Order (lower shows first)</Label>
          <Input id="order_index" type="number" value={formData.order_index} onChange={(e) => set('order_index', Number(e.target.value))} className={field} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white text-sm font-medium">Description</Label>
        <Textarea id="description" rows={3} value={formData.description} onChange={(e) => set('description', e.target.value)} className="bg-navy-700 border-navy-600 text-white" />
      </div>

      <FileUpload
        onUpload={(url) => set('image_url', url)}
        onRemove={() => set('image_url', '')}
        currentImage={formData.image_url}
        folder="education"
        className="space-y-2"
      />

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Key coursework</Label>
        <div className="flex gap-2">
          <Input
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
            placeholder="Add a subject"
            className={field}
          />
          <Button type="button" variant="outline" size="sm" onClick={addCourse} className="h-9" aria-label="Add subject"><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {formData.coursework.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1">
              {c}
              <button type="button" aria-label={`Remove ${c}`} onClick={() => set('coursework', formData.coursework.filter((x) => x !== c))}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Recognition, leadership &amp; activities</Label>
        <div className="grid gap-2 md:grid-cols-[1fr_8rem_12rem_auto]">
          <Input value={achTitle} onChange={(e) => setAchTitle(e.target.value)} placeholder="Title" className={field} />
          <Input value={achDetail} onChange={(e) => setAchDetail(e.target.value)} placeholder="Year / span" className={field} />
          <Select value={achGroup} onValueChange={(v) => setAchGroup(v as EducationAchievement['group'])}>
            <SelectTrigger className={field}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Recognition">Recognition</SelectItem>
              <SelectItem value="Leadership & activities">Leadership &amp; activities</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" size="sm" onClick={addAchievement} className="h-9" aria-label="Add entry"><Plus className="w-4 h-4" /></Button>
        </div>
        <ul className="space-y-1">
          {formData.achievements.map((a, i) => (
            <li key={`${a.title}-${i}`} className="flex items-center justify-between gap-3 rounded bg-navy-700/60 px-3 py-1.5 text-sm text-white">
              <span className="min-w-0 truncate">
                {a.title}
                {a.detail && <span className="text-muted-foreground"> · {a.detail}</span>}
                <span className="text-muted-foreground"> · {a.group}</span>
              </span>
              <button type="button" aria-label={`Remove ${a.title}`} onClick={() => set('achievements', formData.achievements.filter((_, j) => j !== i))}>
                <X className="w-4 h-4 text-red-400" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving…' : education ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}
