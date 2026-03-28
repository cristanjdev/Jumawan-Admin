import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { FileUpload } from '@/components/ui/FileUpload'
import { Project, ProjectFormData } from '../../types'

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const ProjectForm = ({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image_url: '',
    live_url: '',
    github_url: '',
    technologies: [],
    featured: false,
    order_index: 0
  })
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        image_url: project.image_url || '',
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        technologies: project.technologies,
        featured: project.featured,
        order_index: project.order_index
      })
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white text-sm font-medium">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Project title"
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
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured" className="text-white text-sm font-medium">Featured Project</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white text-sm font-medium">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Project description"
          required
          className="bg-navy-700 border-navy-600 text-white"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="live_url" className="text-white text-sm font-medium">Live URL</Label>
          <Input
            id="live_url"
            value={formData.live_url}
            onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
            placeholder="Live demo URL"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github_url" className="text-white text-sm font-medium">GitHub URL</Label>
          <Input
            id="github_url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            placeholder="GitHub repository URL"
            className="bg-navy-700 border-navy-600 text-white h-9"
          />
        </div>
      </div>

      <FileUpload
        onUpload={(url) => setFormData({ ...formData, image_url: url })}
        currentImage={formData.image_url}
        folder="projects"
        className="space-y-2"
      />

      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add technology"
            className="bg-navy-700 border-navy-600 text-white h-9"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" onClick={addTechnology} variant="outline" className="h-9">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="flex items-center gap-1 text-xs">
              {tech}
              <button
                type="button"
                onClick={() => removeTechnology(tech)}
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
          {project ? 'Update' : 'Create'} Project
        </Button>
      </div>
    </form>
  )
}

