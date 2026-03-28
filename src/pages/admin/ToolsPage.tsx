import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ToolList } from '@/components/admin/Tools/ToolList';
import { ToolForm } from '@/components/admin/Tools/ToolForm';
import { useTools } from '@/hooks/useTools';
import { Tool, ToolFormData } from '@/lib/types/tools.types';
import { useToast } from '@/hooks/use-toast';

export function ToolsPage() {
  const {
    tools,
    loading,
    error,
    createTool,
    updateTool,
    deleteTool,
    toggleToolActive
  } = useTools();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  // Show error message if tools table doesn't exist
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-500 mb-2">Database Setup Required</h2>
          <p className="text-red-400 mb-4">
            The tools table doesn't exist in your database yet. Please run the migration to create it.
          </p>
          <div className="bg-navy-800 rounded p-4 border border-red-500/20">
            <p className="text-sm font-semibold text-gray-300 mb-2">Steps to fix:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Ensure Convex is running (<code className="bg-navy-900 px-2 py-1 rounded">npx convex dev</code>)</li>
              <li>Verify the tools table exists in the Convex schema</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <p className="text-sm text-red-400 mt-4">Error: {error}</p>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingTool(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTool(id);
      toast({
        title: 'Success',
        description: 'Tool deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tool',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await toggleToolActive(id, isActive);
      toast({
        title: 'Success',
        description: `Tool ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tool status',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (data: ToolFormData) => {
    setFormLoading(true);
    try {
      if (editingTool) {
        await updateTool({ id: editingTool.id, ...data });
        toast({
          title: 'Success',
          description: 'Tool updated successfully',
        });
      } else {
        await createTool(data);
        toast({
          title: 'Success',
          description: 'Tool created successfully',
        });
      }
      setIsDialogOpen(false);
      setEditingTool(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingTool ? 'update' : 'create'} tool`,
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setEditingTool(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-navy-800 p-6 rounded-lg border border-navy-700">
        <div>
          <h1 className="text-3xl font-bold text-white">Tools Management</h1>
          <p className="text-muted-foreground">Manage your technology stack tools</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-navy-800 border-navy-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTool ? 'Edit Tool' : 'Add New Tool'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingTool ? 'Update tool details' : 'Add a new tool to your stack'}
              </DialogDescription>
            </DialogHeader>
            <ToolForm
              tool={editingTool || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={formLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ToolList
        tools={tools}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}