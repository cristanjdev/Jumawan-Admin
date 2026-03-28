import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { DashboardStats } from '../components/Dashboard/DashboardStats'
import { RecentMessages } from '../components/Dashboard/RecentMessages'
import { RecentProjects } from '../components/Dashboard/RecentProjects'
import { useDashboardStats } from '../hooks/useDashboard'

export const DashboardPage = () => {
  const { data: stats, isLoading, refetch } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin panel</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="hover:bg-primary/10 hover:border-primary/30"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages messages={stats.recentMessages} />
        <RecentProjects projects={stats.recentProjects} />
      </div>
    </div>
  )
}

