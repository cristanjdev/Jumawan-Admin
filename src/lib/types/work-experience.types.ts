export interface WorkExperience {
  id: string
  company: string
  position: string
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship' | 'Contract'
  location: string
  start_date: string
  end_date?: string
  current: boolean
  duration?: string
  achievements: string[]
  responsibilities: string[]
  technologies: string[]
  team_size?: string
  company_size?: string
  image_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface WorkExperienceFormData {
  company: string
  position: string
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship' | 'Contract'
  location: string
  start_date: string
  end_date: string
  current: boolean
  duration: string
  achievements: string[]
  responsibilities: string[]
  technologies: string[]
  team_size: string
  company_size: string
  image_url: string
  order_index: number
}

export interface CreateWorkExperienceInput extends Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateWorkExperienceInput extends Partial<CreateWorkExperienceInput> {
  id: string
}

