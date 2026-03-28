export interface Analytics {
  id: string
  event_type: string
  event_data?: any
  user_agent?: string
  ip_address?: string
  referrer?: string
  page_url?: string
  created_at: string
}

export interface PageViewData {
  page: string
  views: number
}

export interface DailyStat {
  date: string
  views: number
  visitors: number
}

export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  pageViews: PageViewData[]
  dailyStats: DailyStat[]
  recentActivity: Analytics[]
}

