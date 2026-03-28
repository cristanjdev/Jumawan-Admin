import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, Users, TrendingUp, Calendar, Activity } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7')
  const { data: analytics, isLoading } = useAnalytics(parseInt(timeRange))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-muted-foreground">Track your portfolio performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-navy-700 border-navy-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-navy-800 border-navy-700">
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-navy-800 border-navy-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Page views in the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy-800 border-navy-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Unique visitors in the last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-navy-800 border-navy-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg. Views/Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(analytics.totalViews / parseInt(timeRange))}
            </div>
            <p className="text-xs text-muted-foreground">
              Average daily page views
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-navy-800 border-navy-700">
        <CardHeader>
          <CardTitle className="text-white">Page Views</CardTitle>
          <CardDescription>Most visited pages in the last {timeRange} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.pageViews.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No page views recorded</p>
            ) : (
              analytics.pageViews.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-navy-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.page}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{item.views} views</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-navy-800 border-navy-700">
        <CardHeader>
          <CardTitle className="text-white">Daily Statistics</CardTitle>
          <CardDescription>Views and visitors over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-navy-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-white">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{day.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{day.visitors} visitors</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-navy-800 border-navy-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription>Latest analytics events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-navy-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-white font-medium">{activity.event_type}</p>
                      {activity.page_url && (
                        <p className="text-sm text-muted-foreground">{activity.page_url}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

