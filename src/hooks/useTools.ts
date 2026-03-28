import { useEffect } from 'react';
import { useToolStore } from '@/stores/useToolStore';

export function useTools(page = 1, limit = 100) {
  const store = useToolStore();

  useEffect(() => {
    store.fetchTools(page, limit);
    const unsubscribe = store.subscribeToChanges();
    return () => unsubscribe();
  }, [page, limit]);

  return {
    tools: store.tools,
    loading: store.loading,
    error: store.error,
    total: store.total,
    createTool: store.createTool,
    updateTool: store.updateTool,
    deleteTool: store.deleteTool,
    toggleToolActive: store.toggleToolActive,
    refetch: () => store.fetchTools(page, limit),
  };
}