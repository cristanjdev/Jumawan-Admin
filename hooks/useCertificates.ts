import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { certificateService } from '../lib/services'
import { Certificate, CreateCertificateInput, UpdateCertificateInput } from '../lib/types'

export const queryKeys = {
  certificates: ['certificates'] as const,
  certificate: (id: string) => ['certificates', id] as const,
}

export const useCertificates = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.certificates, page, limit],
    queryFn: () => certificateService.getAll(page, limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: queryKeys.certificate(id),
    queryFn: () => certificateService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateCertificate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (certificate: CreateCertificateInput) => certificateService.create(certificate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates })
    },
  })
}

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (certificate: UpdateCertificateInput) => certificateService.update(certificate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates })
      queryClient.invalidateQueries({ queryKey: queryKeys.certificate(data.id) })
    },
  })
}

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => certificateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates })
    },
  })
}
