import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { Analytics, AnalyticsData } from '../types'

function mapAnalytics(doc: any): Analytics {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
  }
}

export const analyticsService = {
  async getByDateRange(days: number = 7): Promise<AnalyticsData> {
    const result = await convexClient.query(api.analytics.getByDateRange, { days })
    return {
      ...result,
      recentActivity: (result.recentActivity || []).map(mapAnalytics),
    }
  },

  async getRecentActivity(limit: number = 20) {
    const docs = await convexClient.query(api.analytics.list, { limit })
    return (docs || []).map(mapAnalytics) as Analytics[]
  },
}

