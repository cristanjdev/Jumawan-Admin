import { create } from 'zustand';
import { WorkExperience, CreateWorkExperienceInput, UpdateWorkExperienceInput } from '@/lib/types';
import { workExperienceService } from '@/lib/services';

interface ExperienceState {
    experiences: WorkExperience[];
    total: number;
    loading: boolean;
    error: string | null;

    fetchExperiences: (page?: number, limit?: number) => Promise<void>;
    createExperience: (experienceData: CreateWorkExperienceInput) => Promise<WorkExperience>;
    updateExperience: (experienceData: UpdateWorkExperienceInput) => Promise<WorkExperience>;
    deleteExperience: (id: string) => Promise<void>;
    subscribeToChanges: () => () => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
    experiences: [],
    total: 0,
    loading: false,
    error: null,

    fetchExperiences: async (page = 1, limit = 100) => {
        try {
            set({ loading: true, error: null });
            const { data, count } = await workExperienceService.getAll(page, limit);
            set({ experiences: data, total: count });
        } catch (err) {
            console.error('Error fetching experiences:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch experiences';
            set({ error: errorMessage, experiences: [], total: 0 });
        } finally {
            set({ loading: false });
        }
    },

    createExperience: async (experienceData) => {
        try {
            const newExperience = await workExperienceService.create(experienceData);
            set((state) => ({
                experiences: [...state.experiences, newExperience],
                total: state.total + 1
            }));
            return newExperience;
        } catch (err) {
            console.error('Error creating experience:', err);
            throw err;
        }
    },

    updateExperience: async (experienceData) => {
        try {
            const updatedExperience = await workExperienceService.update(experienceData);
            set((state) => ({
                experiences: state.experiences.map((exp) =>
                    exp.id === updatedExperience.id ? updatedExperience : exp
                )
            }));
            return updatedExperience;
        } catch (err) {
            console.error('Error updating experience:', err);
            throw err;
        }
    },

    deleteExperience: async (id) => {
        try {
            await workExperienceService.delete(id);
            set((state) => ({
                experiences: state.experiences.filter((exp) => exp.id !== id),
                total: state.total - 1
            }));
        } catch (err) {
            console.error('Error deleting experience:', err);
            throw err;
        }
    },

    subscribeToChanges: () => {
        const interval = setInterval(() => { get().fetchExperiences(); }, 30000);
        return () => { clearInterval(interval); };
    },
}));
