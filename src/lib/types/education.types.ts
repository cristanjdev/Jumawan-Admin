export interface EducationAchievement {
  title: string
  detail?: string
  group: 'Recognition' | 'Leadership & activities'
}

export interface Education {
  id: string
  degree: string
  level: string
  school: string
  location: string
  period: string
  gpa: string
  status: string
  honors?: string
  description: string
  coursework: string[]
  achievements: EducationAchievement[]
  image_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface CreateEducationInput extends Omit<Education, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateEducationInput extends Partial<CreateEducationInput> {
  id: string
}
