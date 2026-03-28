import { AboutSectionImage } from '@/lib/types/about.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';

interface AboutImageListProps {
    readonly images: AboutSectionImage[];
    readonly loading: boolean;
    readonly onEdit: (img: AboutSectionImage) => void;
    readonly onDelete: (id: string) => void;
    readonly onToggleActive: (id: string, isActive: boolean) => void;
    readonly onReorder: (items: { id: string; order_index: number }[]) => void;
}

export function AboutImageList({ images, loading, onEdit, onDelete, onToggleActive, onReorder }: AboutImageListProps) {
    const handleMoveUp = (index: number) => {
        if (index <= 0) return;
        const reordered = [...images];
        [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
        onReorder(reordered.map((img, i) => ({ id: img.id, order_index: i })));
    };

    const handleMoveDown = (index: number) => {
        if (index >= images.length - 1) return;
        const reordered = [...images];
        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
        onReorder(reordered.map((img, i) => ({ id: img.id, order_index: i })));
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <Card className="bg-navy-800/50 border-navy-700">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <ImageIcon className="w-10 h-10 text-gray-500 mb-2" />
                    <p className="text-muted-foreground text-sm">No carousel images yet. Add images for the About section.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {images.map((img, index) => (
                <Card
                    key={img.id}
                    className={`bg-navy-800/50 border-navy-700 transition-all hover:border-primary/30 ${img.is_active ? '' : 'opacity-50'}`}
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
                                    disabled={index === images.length - 1}
                                    aria-label="Move down"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-navy-900 flex-shrink-0">
                                <img
                                    src={img.image_url}
                                    alt={img.label}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{img.label || 'Untitled'}</p>
                                <p className="text-xs text-gray-500 truncate">{img.image_url}</p>
                            </div>
                            <span className="text-xs text-gray-500 font-mono w-8 text-center" title="Order">#{img.order_index + 1}</span>
                            <Switch
                                checked={img.is_active}
                                onCheckedChange={(checked) => onToggleActive(img.id, checked)}
                                className="data-[state=checked]:bg-cyan-500"
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(img)}
                                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-navy-700"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(img.id)}
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
