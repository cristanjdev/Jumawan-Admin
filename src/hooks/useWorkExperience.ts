import { useEffect } from 'react';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { CreateWorkExperienceInput, UpdateWorkExperienceInput } from '@/lib/types';

export const useWorkExperiences = (page = 1, limit = 100) => {
  const store = useExperienceStore();

  useEffect(() => {
    store.fetchExperiences(page, limit);
    const unsubscribe = store.subscribeToChanges();
    return () => unsubscribe();
  }, [page, limit]);

  return {
    data: {
      data: store.experiences,
      count: store.total
    },
    isLoading: store.loading,
    error: store.error,
    total: store.total,
    refetch: () => store.fetchExperiences(page, limit),
  };
};

export const useWorkExperience = (id: string) => {
  const store = useExperienceStore();
  const experience = store.experiences.find(e => e.id === id);

  return {
    data: experience,
    isLoading: store.loading,
  };
};

export const useCreateWorkExperience = () => {
  const store = useExperienceStore();
  return {
    mutateAsync: (data: CreateWorkExperienceInput) => store.createExperience(data),
    isLoading: store.loading
  };
};

export const useUpdateWorkExperience = () => {
  const store = useExperienceStore();
  return {
    mutateAsync: (data: UpdateWorkExperienceInput) => store.updateExperience(data),
    isLoading: store.loading
  };
};

export const useDeleteWorkExperience = () => {
  const store = useExperienceStore();
  return {
    mutateAsync: (id: string) => store.deleteExperience(id),
    isLoading: store.loading
  };
};

