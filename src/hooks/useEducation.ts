import { useEffect } from 'react'
import { useEducationStore } from '@/stores/useEducationStore'

export const useEducation = () => {
  const store = useEducationStore()

  useEffect(() => {
    store.fetchEducation()
  }, [])

  return {
    education: store.education,
    isLoading: store.loading,
    error: store.error,
    create: store.createEducation,
    update: store.updateEducation,
    remove: store.deleteEducation,
  }
}
