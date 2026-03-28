import { create } from 'zustand';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/lib/types';
import { projectService } from '@/lib/services';

interface ProjectState {
    projects: Project[];
    total: number;
    loading: boolean;
    error: string | null;

    fetchProjects: (page?: number, limit?: number) => Promise<void>;
    createProject: (projectData: CreateProjectInput) => Promise<Project>;
    updateProject: (projectData: UpdateProjectInput) => Promise<Project>;
    deleteProject: (id: string) => Promise<void>;
    subscribeToChanges: () => () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    total: 0,
    loading: false,
    error: null,

    fetchProjects: async (page = 1, limit = 100) => {
        try {
            set({ loading: true, error: null });
            const { data, count } = await projectService.getAll(page, limit);
            set({ projects: data, total: count });
        } catch (err) {
            console.error('Error fetching projects:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
            set({ error: errorMessage, projects: [], total: 0 });
        } finally {
            set({ loading: false });
        }
    },

    createProject: async (projectData) => {
        try {
            const newProject = await projectService.create(projectData);
            set((state) => ({
                projects: [...state.projects, newProject],
                total: state.total + 1
            }));
            return newProject;
        } catch (err) {
            console.error('Error creating project:', err);
            throw err;
        }
    },

    updateProject: async (projectData) => {
        try {
            const updatedProject = await projectService.update(projectData);
            set((state) => ({
                projects: state.projects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            }));
            return updatedProject;
        } catch (err) {
            console.error('Error updating project:', err);
            throw err;
        }
    },

    deleteProject: async (id) => {
        try {
            await projectService.delete(id);
            set((state) => ({
                projects: state.projects.filter((project) => project.id !== id),
                total: state.total - 1
            }));
        } catch (err) {
            console.error('Error deleting project:', err);
            throw err;
        }
    },

    subscribeToChanges: () => {
        // Convex handles reactivity automatically; poll as fallback
        const interval = setInterval(() => { get().fetchProjects(); }, 30000);
        return () => { clearInterval(interval); };
    },
}));
