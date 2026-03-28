export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  live_url?: string
  github_url?: string
  technologies: string[]
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface ProjectFormData {
  title: string
  description: string
  image_url: string
  live_url: string
  github_url: string
  technologies: string[]
  featured: boolean
  order_index: number
}

export interface CreateProjectInput extends Omit<Project, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string
}

