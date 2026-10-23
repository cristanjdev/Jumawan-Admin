import { create } from 'zustand'
import { Education, CreateEducationInput, UpdateEducationInput } from '@/lib/types'
import { educationService } from '@/lib/services'

interface EducationState {
    education: Education[]
    loading: boolean
    error: string | null

    fetchEducation: () => Promise<void>
    createEducation: (data: CreateEducationInput) => Promise<Education>
    updateEducation: (data: UpdateEducationInput) => Promise<Education>
    deleteEducation: (id: string) => Promise<void>
}

export const useEducationStore = create<EducationState>((set) => ({
    education: [],
    loading: false,
    error: null,

    fetchEducation: async () => {
        try {
            set({ loading: true, error: null })
            set({ education: await educationService.getAll() })
        } catch (err) {
            console.error('Error fetching education:', err)
            set({ error: err instanceof Error ? err.message : 'Failed to fetch education', education: [] })
        } finally {
            set({ loading: false })
        }
    },

    createEducation: async (data) => {
        const created = await educationService.create(data)
        set((state) => ({ education: [...state.education, created].sort((a, b) => a.order_index - b.order_index) }))
        return created
    },

    updateEducation: async (data) => {
        const updated = await educationService.update(data)
        set((state) => ({ education: state.education.map((e) => (e.id === updated.id ? updated : e)) }))
        return updated
    },

    deleteEducation: async (id) => {
        await educationService.delete(id)
        set((state) => ({ education: state.education.filter((e) => e.id !== id) }))
    },
}))
