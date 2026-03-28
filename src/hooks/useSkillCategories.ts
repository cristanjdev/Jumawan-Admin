import { useEffect } from 'react';
import { useSkillCategoryStore } from '@/stores/useSkillCategoryStore';

export function useSkillCategories() {
    const store = useSkillCategoryStore();

    useEffect(() => {
        store.fetchCategories();
    }, []);

    return {
        categories: store.categories,
        loading: store.loading,
        error: store.error,
        createCategory: store.createCategory,
        updateCategory: store.updateCategory,
        deleteCategory: store.deleteCategory,
        toggleActive: store.toggleActive,
        reorderCategories: store.reorderCategories,
        refetch: store.fetchCategories,
    };
}
