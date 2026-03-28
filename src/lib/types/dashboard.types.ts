import { ContactMessage } from './contact.types'
import { Project } from './project.types'

export interface DashboardStats {
  totalProjects: number
  totalCertificates: number
  totalMessages: number
  unreadMessages: number
  recentMessages: ContactMessage[]
  recentProjects: Project[]
}

