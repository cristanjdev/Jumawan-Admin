import { HeroSetting } from '@/lib/types/hero.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, GripVertical } from 'lucide-react';

interface HeroBadgeListProps {
    badges: HeroSetting[];
    loading: boolean;
    onEdit: (badge: HeroSetting) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
}

export function HeroBadgeList({ badges, loading, onEdit, onDelete, onToggleActive }: HeroBadgeListProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (badges.length === 0) {
        return (
            <Card className="bg-navy-800/50 border-navy-700">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm">No badges yet. Add your first badge!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {badges.map((badge) => (
                <Card
                    key={badge.id}
                    className={`bg-navy-800/50 border-navy-700 transition-all hover:border-primary/30 ${!badge.is_active ? 'opacity-50' : ''}`}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            {/* Drag Handle (visual only for now) */}
                            <div className="text-gray-500 cursor-grab hover:text-gray-400">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Badge Preview */}
                            <div className="flex-1">
                                <Badge
                                    variant="outline"
                                    className={`px-3 py-1.5 text-sm ${badge.is_active ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' : 'text-gray-400 border-gray-500/30'}`}
                                >
                                    {badge.value}
                                </Badge>
                            </div>

                            {/* Order Index */}
                            <span className="text-xs text-gray-500 font-mono">#{badge.order_index}</span>

                            {/* Active Toggle */}
                            <Switch
                                checked={badge.is_active}
                                onCheckedChange={(checked) => onToggleActive(badge.id, checked)}
                                className="data-[state=checked]:bg-cyan-500"
                            />

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(badge)}
                                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-navy-700"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(badge.id)}
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
