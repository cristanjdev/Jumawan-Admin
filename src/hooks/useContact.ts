import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactService } from '@/lib/services'
import { MessageStatus, UpdateMessageStatusInput } from '@/lib/types'

export const queryKeys = {
  contactMessages: ['contactMessages'] as const,
  contactMessage: (id: string) => ['contactMessages', id] as const,
}

export const useContactMessages = (page = 1, limit = 10, statusFilter: MessageStatus | 'all' = 'all') => {
  return useQuery({
    queryKey: [...queryKeys.contactMessages, page, limit, statusFilter],
    queryFn: () => contactService.getAll(page, limit, statusFilter),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (input: UpdateMessageStatusInput) => contactService.updateStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages })
    },
  })
}

export const useDeleteMessage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactMessages })
    },
  })
}

