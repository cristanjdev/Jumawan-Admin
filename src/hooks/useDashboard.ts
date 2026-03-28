import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/lib/services'

export const queryKeys = {
  dashboardStats: ['dashboardStats'] as const,
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => dashboardService.getStats(),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

