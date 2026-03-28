import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { DashboardStats } from '../types'

function mapMessage(doc: any) {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  }
}

function mapProject(doc: any) {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  }
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const stats = await convexClient.query(api.dashboard.getStats, {})
    return {
      totalProjects: stats.totalProjects,
      totalCertificates: stats.totalCertificates,
      totalMessages: stats.totalMessages,
      unreadMessages: stats.unreadMessages,
      recentMessages: (stats.recentMessages || []).map(mapMessage),
      recentProjects: (stats.recentProjects || []).map(mapProject),
    }
  },
}

