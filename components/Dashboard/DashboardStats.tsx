import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen, Award, MessageSquare, Mail } from 'lucide-react'
import { DashboardStats as DashboardStatsType } from '../../types'

interface DashboardStatsProps {
  stats: DashboardStatsType
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-navy-800 border-navy-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
          <p className="text-xs text-muted-foreground">Portfolio projects</p>
        </CardContent>
      </Card>

      <Card className="bg-navy-800 border-navy-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Certificates</CardTitle>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalCertificates}</div>
          <p className="text-xs text-muted-foreground">Achievements & certifications</p>
        </CardContent>
      </Card>

      <Card className="bg-navy-800 border-navy-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">Contact form submissions</p>
        </CardContent>
      </Card>

      <Card className="bg-navy-800 border-navy-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Unread Messages</CardTitle>
          <Mail className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.unreadMessages}</div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </CardContent>
      </Card>
    </div>
  )
}

