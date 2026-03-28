import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/lib/services'

export const queryKeys = {
  analytics: ['analytics'] as const,
}

export const useAnalytics = (days: number = 7) => {
  return useQuery({
    queryKey: [...queryKeys.analytics, days],
    queryFn: () => analyticsService.getByDateRange(days),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  })
}

