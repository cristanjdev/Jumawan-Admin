import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WorkExperience, WorkExperienceFormData } from '@/lib/types'

interface WorkExperienceFormProps {
  experience?: WorkExperience | null
  onSubmit: (data: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const WorkExperienceForm = ({ experience, onSubmit, onCancel, isLoading }: WorkExperienceFormProps) => {
  const [formData, setFormData] = useState<WorkExperienceFormData>({
    company: '',
    position: '',
    type: 'Full-time',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    duration: '',
    achievements: [],
    responsibilities: [],
    technologies: [],
    team_size: '',
    company_size: '',
    order_index: 0
  })
  const [achievementInput, setAchievementInput] = useState('')
  const [responsibilityInput, setResponsibilityInput] = useState('')
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        type: experience.type,
        location: experience.location,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        current: experience.current,
        duration: experience.duration || '',
        achievements: experience.achievements,
        responsibilities: experience.responsibilities,
        technologies: experience.technologies,
        team_size: experience.team_size || '',
        company_size: experience.company_size || '',
        order_index: experience.order_index
      })
    }
  }, [experience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addItem = (field: 'achievements' | 'responsibilities' | 'technologies', input: string, setInput: (v: string) => void) => {
    if (input.trim() && !formData[field].includes(input.trim())) {
      setFormData({
        ...formData,
        [field]: [...formData[field], input.trim()]
      })
      setInput('')
    }
  }

  const removeItem = (field: 'achievements' | 'responsibilities' | 'technologies', item: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter(i => i !== item)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-white text-sm font-medium">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company name"
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="position" className="text-white text-sm font-medium">Position *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Job title"
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-white text-sm font-medium">Type *</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="bg-navy-700 border-navy-600 text-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-white text-sm font-medium">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="City, Country"
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_index" className="text-white text-sm font-medium">Order Index</Label>
          <Input
            id="order_index"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            placeholder="Display order"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-white text-sm font-medium">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-white text-sm font-medium">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            disabled={formData.current}
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="current"
            checked={formData.current}
            onCheckedChange={(checked) => setFormData({ ...formData, current: checked, end_date: checked ? '' : formData.end_date })}
          />
          <Label htmlFor="current" className="text-white text-sm font-medium">Current Position</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-white text-sm font-medium">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 1+ year"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team_size" className="text-white text-sm font-medium">Team Size</Label>
          <Input
            id="team_size"
            value={formData.team_size}
            onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
            placeholder="e.g., Solo contractor"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_size" className="text-white text-sm font-medium">Company Size</Label>
        <Input
          id="company_size"
          value={formData.company_size}
          onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
          placeholder="e.g., Self-employed"
          className="bg-navy-700 border-navy-600 text-white h-9"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Achievements</Label>
        <div className="flex gap-2">
          <Input
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
            placeholder="Add achievement"
            className="bg-navy-700 border-navy-600 text-white h-9"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('achievements', achievementInput, setAchievementInput))}
          />
          <Button type="button" onClick={() => addItem('achievements', achievementInput, setAchievementInput)} variant="outline" className="h-9">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.achievements.map((item, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs">
              {item}
              <button
                type="button"
                onClick={() => removeItem('achievements', item)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Responsibilities</Label>
        <div className="flex gap-2">
          <Input
            value={responsibilityInput}
            onChange={(e) => setResponsibilityInput(e.target.value)}
            placeholder="Add responsibility"
            className="bg-navy-700 border-navy-600 text-white h-9"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('responsibilities', responsibilityInput, setResponsibilityInput))}
          />
          <Button type="button" onClick={() => addItem('responsibilities', responsibilityInput, setResponsibilityInput)} variant="outline" className="h-9">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.responsibilities.map((item, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs">
              {item}
              <button
                type="button"
                onClick={() => removeItem('responsibilities', item)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add technology"
            className="bg-navy-700 border-navy-600 text-white h-9"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('technologies', techInput, setTechInput))}
          />
          <Button type="button" onClick={() => addItem('technologies', techInput, setTechInput)} variant="outline" className="h-9">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="flex items-center gap-1 text-xs">
              {tech}
              <button
                type="button"
                onClick={() => removeItem('technologies', tech)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-navy-600">
        <Button type="button" variant="outline" onClick={onCancel} className="h-9" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="h-9" disabled={isLoading}>
          {experience ? 'Update' : 'Create'} Experience
        </Button>
      </div>
    </form>
  )
}

