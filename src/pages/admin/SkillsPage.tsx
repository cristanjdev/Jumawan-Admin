import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Sparkles } from 'lucide-react';
import { SkillCategoryList } from '@/components/admin/Skills/SkillCategoryList';
import { SkillCategoryForm } from '@/components/admin/Skills/SkillCategoryForm';
import { useSkillCategories } from '@/hooks/useSkillCategories';
import { SkillCategory } from '@/lib/types/skill.types';
import { useToast } from '@/hooks/use-toast';

export function SkillsPage() {
    const {
        categories,
        loading,
        createCategory,
        updateCategory,
        deleteCategory,
        toggleActive,
        reorderCategories,
    } = useSkillCategories();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<SkillCategory | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const { toast } = useToast();

    const handleAdd = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const handleEdit = (cat: SkillCategory) => {
        setEditing(cat);
        setDialogOpen(true);
    };

    const handleFormSubmit = async (data: { title: string; icon_slug: string; color_slug: string; skills: string[]; description: string; examples: string[] }) => {
        setFormLoading(true);
        try {
            if (editing) {
                await updateCategory({ id: editing.id, ...data });
                toast({ title: 'Success', description: 'Category updated' });
            } else {
                await createCategory({
                    ...data,
                    order_index: categories.length,
                });
                toast({ title: 'Success', description: 'Category added' });
            }
            setDialogOpen(false);
            setEditing(null);
        } catch {
            toast({
                title: 'Error',
                description: editing ? 'Failed to update category' : 'Failed to add category',
                variant: 'destructive',
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            toast({ title: 'Success', description: 'Category removed' });
        } catch {
            toast({ title: 'Error', description: 'Failed to remove category', variant: 'destructive' });
        }
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        try {
            await toggleActive(id, isActive);
            toast({ title: 'Success', description: isActive ? 'Category shown' : 'Category hidden' });
        } catch {
            toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
        }
    };

    const handleReorder = async (items: { id: string; order_index: number }[]) => {
        try {
            await reorderCategories(items);
            toast({ title: 'Success', description: 'Order updated' });
        } catch {
            toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-navy-800 p-6 rounded-lg border border-navy-700">
                <div>
                    <h1 className="text-3xl font-bold text-white">Skills Section</h1>
                    <p className="text-muted-foreground">Manage skill categories and skills shown on the portfolio</p>
                </div>
            </div>

            <Card className="bg-navy-800 border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Skill Categories</CardTitle>
                            <CardDescription>Categories and skills displayed in the Skills section</CardDescription>
                        </div>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAdd} size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-navy-800 border-navy-700 text-white max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-white">
                                    {editing ? 'Edit Category' : 'Add Category'}
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {editing ? 'Update title, icon, color and skills' : 'Add a new skill category'}
                                </DialogDescription>
                            </DialogHeader>
                            <SkillCategoryForm
                                category={editing}
                                onSubmit={handleFormSubmit}
                                onCancel={() => { setDialogOpen(false); setEditing(null); }}
                                isLoading={formLoading}
                                nextOrderIndex={categories.length}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <SkillCategoryList
                        categories={categories}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggle}
                        onReorder={handleReorder}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
