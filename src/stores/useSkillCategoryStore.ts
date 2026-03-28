import { create } from 'zustand';
import {
    SkillCategory,
    CreateSkillCategoryInput,
    UpdateSkillCategoryInput,
} from '@/lib/types/skill.types';
import { skillCategoryService } from '@/lib/services/skill-category.service';

interface SkillCategoryState {
    categories: SkillCategory[];
    loading: boolean;
    error: string | null;

    fetchCategories: () => Promise<void>;
    createCategory: (data: CreateSkillCategoryInput) => Promise<SkillCategory>;
    updateCategory: (data: UpdateSkillCategoryInput) => Promise<SkillCategory>;
    deleteCategory: (id: string) => Promise<void>;
    toggleActive: (id: string, is_active: boolean) => Promise<SkillCategory>;
    reorderCategories: (items: { id: string; order_index: number }[]) => Promise<void>;
}

export const useSkillCategoryStore = create<SkillCategoryState>((set, get) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        try {
            set({ loading: true, error: null });
            const { data, error } = await skillCategoryService.getAll();
            if (error) {
                set({ error: 'Failed to fetch skill categories', categories: [] });
                return;
            }
            set({ categories: data || [] });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch skill categories';
            set({ error: msg, categories: [] });
        } finally {
            set({ loading: false });
        }
    },

    createCategory: async (input) => {
        const newCat = await skillCategoryService.create(input);
        set((state) => ({
            categories: [...state.categories, newCat].sort((a, b) => a.order_index - b.order_index),
        }));
        return newCat;
    },

    updateCategory: async (data) => {
        const updated = await skillCategoryService.update(data);
        set((state) => ({
            categories: state.categories
                .map((c) => (c.id === updated.id ? updated : c))
                .sort((a, b) => a.order_index - b.order_index),
        }));
        return updated;
    },

    deleteCategory: async (id) => {
        await skillCategoryService.delete(id);
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
    },

    toggleActive: async (id, is_active) => {
        const updated = await skillCategoryService.toggleActive(id, is_active);
        set((state) => ({
            categories: state.categories
                .map((c) => (c.id === updated.id ? updated : c))
                .sort((a, b) => a.order_index - b.order_index),
        }));
        return updated;
    },

    reorderCategories: async (items) => {
        await skillCategoryService.reorder(items);
        await get().fetchCategories();
    },
}));
