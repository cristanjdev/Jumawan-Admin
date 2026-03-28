import { SkillCategory } from '@/lib/types/skill.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface SkillCategoryListProps {
    readonly categories: SkillCategory[];
    readonly loading: boolean;
    readonly onEdit: (cat: SkillCategory) => void;
    readonly onDelete: (id: string) => void;
    readonly onToggleActive: (id: string, isActive: boolean) => void;
    readonly onReorder: (items: { id: string; order_index: number }[]) => void;
}

export function SkillCategoryList({
    categories,
    loading,
    onEdit,
    onDelete,
    onToggleActive,
    onReorder,
}: SkillCategoryListProps) {
    const handleMoveUp = (index: number) => {
        if (index <= 0) return;
        const reordered = [...categories];
        [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
        onReorder(reordered.map((c, i) => ({ id: c.id, order_index: i })));
    };

    const handleMoveDown = (index: number) => {
        if (index >= categories.length - 1) return;
        const reordered = [...categories];
        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
        onReorder(reordered.map((c, i) => ({ id: c.id, order_index: i })));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <Card className="bg-navy-800/50 border-navy-700">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">No skill categories yet. Add your first category!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {categories.map((cat, index) => (
                <Card
                    key={cat.id}
                    className={`bg-navy-800/50 border-navy-700 transition-all hover:border-primary/30 ${cat.is_active ? '' : 'opacity-50'}`}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-0.5" title="Change order">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-30"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    aria-label="Move up"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-30"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === categories.length - 1}
                                    aria-label="Move down"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium">{cat.title}</p>
                                <p className="text-xs text-gray-500">
                                    {cat.icon_slug} · {cat.color_slug} · {cat.skills?.length ?? 0} skills
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {(cat.skills ?? []).slice(0, 6).map((s, i) => (
                                        <span key={`${cat.id}-${s}-${i}`} className="text-xs px-1.5 py-0.5 rounded bg-navy-700 text-gray-400">
                                            {s}
                                        </span>
                                    ))}
                                    {(cat.skills?.length ?? 0) > 6 && (
                                        <span className="text-xs text-gray-500">+{(cat.skills?.length ?? 0) - 6} more</span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 font-mono w-8 text-center">#{cat.order_index + 1}</span>
                            <Switch
                                checked={cat.is_active}
                                onCheckedChange={(checked) => onToggleActive(cat.id, checked)}
                                className="data-[state=checked]:bg-cyan-500"
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(cat)}
                                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-navy-700"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(cat.id)}
                                    className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
