import { Button } from '@/components/ui/button';
import { ToolCard } from './ToolCard';
import { Tool } from '@/lib/types/tools.types';
import { Plus } from 'lucide-react';

interface ToolListProps {
  tools: Tool[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export function ToolList({
  tools,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive
}: ToolListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-square bg-navy-800 rounded-lg animate-pulse border border-navy-700"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tools Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {tools.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-navy-800 rounded-lg border border-navy-700">
            <div className="text-gray-400 mb-2">No tools found</div>
            <div className="text-sm text-gray-500 mb-4">
              Get started by adding your first tool
            </div>
            <Button onClick={onAdd} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <Plus className="w-4 h-4 mr-2" />
              Add Tool
            </Button>
          </div>
        ) : (
          tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))
        )}
      </div>

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-400">
        Showing {tools.length} tools
      </div>
    </div>
  );
}