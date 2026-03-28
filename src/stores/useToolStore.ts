import { create } from 'zustand';
import { Tool, CreateToolInput, UpdateToolInput } from '@/lib/types/tools.types';
import { toolsService } from '@/lib/services/tools.service';

interface ToolState {
    tools: Tool[];
    total: number;
    loading: boolean;
    error: string | null;

    fetchTools: (page?: number, limit?: number) => Promise<void>;
    createTool: (toolData: CreateToolInput) => Promise<Tool>;
    updateTool: (toolData: UpdateToolInput) => Promise<Tool>;
    deleteTool: (id: string) => Promise<void>;
    toggleToolActive: (id: string, is_active: boolean) => Promise<Tool>;
    subscribeToChanges: () => () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
    tools: [],
    total: 0,
    loading: false,
    error: null,

    fetchTools: async (page = 1, limit = 100) => { // Increased limit to fetch all for now
        try {
            set({ loading: true, error: null });
            const { data, count } = await toolsService.getAll(page, limit);
            set({ tools: data, total: count });
        } catch (err) {
            console.error('Error fetching tools:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tools';
            set({ error: errorMessage, tools: [], total: 0 });
        } finally {
            set({ loading: false });
        }
    },

    createTool: async (toolData) => {
        try {
            const newTool = await toolsService.create(toolData);
            set((state) => ({
                tools: [...state.tools, newTool],
                total: state.total + 1
            }));
            return newTool;
        } catch (err) {
            console.error('Error creating tool:', err);
            throw err;
        }
    },

    updateTool: async (toolData) => {
        try {
            const updatedTool = await toolsService.update(toolData);
            set((state) => ({
                tools: state.tools.map((tool) =>
                    tool.id === updatedTool.id ? updatedTool : tool
                )
            }));
            return updatedTool;
        } catch (err) {
            console.error('Error updating tool:', err);
            throw err;
        }
    },

    deleteTool: async (id) => {
        try {
            await toolsService.delete(id);
            set((state) => ({
                tools: state.tools.filter((tool) => tool.id !== id),
                total: state.total - 1
            }));
        } catch (err) {
            console.error('Error deleting tool:', err);
            throw err;
        }
    },

    toggleToolActive: async (id, is_active) => {
        try {
            const updatedTool = await toolsService.toggleActive(id, is_active);
            set((state) => ({
                tools: state.tools.map((tool) =>
                    tool.id === updatedTool.id ? updatedTool : tool
                )
            }));
            return updatedTool;
        } catch (err) {
            console.error('Error toggling tool active state:', err);
            throw err;
        }
    },

    subscribeToChanges: () => {
        const interval = setInterval(() => { get().fetchTools(); }, 30000);
        return () => { clearInterval(interval); };
    },
}));
