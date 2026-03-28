import { useEffect } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { CreateProjectInput, UpdateProjectInput } from '@/lib/types';

// Adapter to maintain existing hook signature where possible
export const useProjects = (page = 1, limit = 100) => {
  const projects = useProjectStore((state) => state.projects);
  const total = useProjectStore((state) => state.total);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const subscribeToChanges = useProjectStore((state) => state.subscribeToChanges);

  useEffect(() => {
    fetchProjects(page, limit);
    const unsubscribe = subscribeToChanges();
    return () => unsubscribe();
  }, [fetchProjects, subscribeToChanges, page, limit]);

  return {
    data: {
      data: projects,
      count: total,
    },
    isLoading: loading,
    error,
    total,
    refetch: () => fetchProjects(page, limit),
  };
};

export const useProject = (id: string) => {
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);
  const project = projects.find((p) => p.id === id);

  // Note: specific fetch logic for single item is not implemented in logic 
  // because we usually load all. If needed, we can add fetchById to store.

  return {
    data: project,
    isLoading: loading,
  };
};

export const useCreateProject = () => {
  const createProject = useProjectStore((state) => state.createProject);
  const loading = useProjectStore((state) => state.loading);
  return {
    mutateAsync: (data: CreateProjectInput) => createProject(data),
    isLoading: loading,
    isPending: loading,
  };
};

export const useUpdateProject = () => {
  const updateProject = useProjectStore((state) => state.updateProject);
  const loading = useProjectStore((state) => state.loading);
  return {
    mutateAsync: (data: UpdateProjectInput) => updateProject(data),
    isLoading: loading,
    isPending: loading,
  };
};

export const useDeleteProject = () => {
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const loading = useProjectStore((state) => state.loading);
  return {
    mutateAsync: (id: string) => deleteProject(id),
    isLoading: loading,
    isPending: loading,
  };
};

