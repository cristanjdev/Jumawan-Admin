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
import { Plus, ImageIcon } from 'lucide-react';
import { AboutImageList } from '@/components/admin/HeroSettings/AboutImageList';
import { AboutImageForm } from '@/components/admin/HeroSettings/AboutImageForm';
import { useAboutSection } from '@/hooks/useAboutSection';
import { AboutSectionImage } from '@/lib/types/about.types';
import { useToast } from '@/hooks/use-toast';

export function AboutSectionPage() {
    const {
        images: aboutImages,
        loading: aboutLoading,
        createImage: createAboutImage,
        updateImage: updateAboutImage,
        deleteImage: deleteAboutImage,
        toggleActive: toggleAboutImageActive,
        reorderImages,
    } = useAboutSection();

    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    const [editingAboutImage, setEditingAboutImage] = useState<AboutSectionImage | null>(null);
    const [aboutFormLoading, setAboutFormLoading] = useState(false);
    const { toast } = useToast();

    const handleAddAboutImage = () => {
        setEditingAboutImage(null);
        setAboutDialogOpen(true);
    };

    const handleEditAboutImage = (img: AboutSectionImage) => {
        setEditingAboutImage(img);
        setAboutDialogOpen(true);
    };

    const handleAboutFormSubmit = async (data: { image_url: string; label: string }) => {
        setAboutFormLoading(true);
        try {
            if (editingAboutImage) {
                await updateAboutImage({ id: editingAboutImage.id, ...data });
                toast({ title: 'Success', description: 'About image updated successfully' });
            } else {
                await createAboutImage({
                    image_url: data.image_url,
                    label: data.label,
                    order_index: aboutImages.length,
                });
                toast({ title: 'Success', description: 'About image added successfully' });
            }
            setAboutDialogOpen(false);
            setEditingAboutImage(null);
        } catch {
            toast({
                title: 'Error',
                description: `Failed to ${editingAboutImage ? 'update' : 'add'} about image`,
                variant: 'destructive',
            });
        } finally {
            setAboutFormLoading(false);
        }
    };

    const handleDeleteAboutImage = async (id: string) => {
        try {
            await deleteAboutImage(id);
            toast({ title: 'Success', description: 'About image removed' });
        } catch {
            toast({ title: 'Error', description: 'Failed to remove image', variant: 'destructive' });
        }
    };

    const handleToggleAboutImageActive = async (id: string, isActive: boolean) => {
        try {
            await toggleAboutImageActive(id, isActive);
            toast({ title: 'Success', description: `Image ${isActive ? 'shown' : 'hidden'}` });
        } catch {
            toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
        }
    };

    const handleReorder = async (items: { id: string; order_index: number }[]) => {
        try {
            await reorderImages(items);
            toast({ title: 'Success', description: 'Order updated' });
        } catch {
            toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-navy-800 p-6 rounded-lg border border-navy-700">
                <div>
                    <h1 className="text-3xl font-bold text-white">About Section</h1>
                    <p className="text-muted-foreground">Manage carousel images shown in the About section on the portfolio</p>
                </div>
            </div>

            <Card className="bg-navy-800 border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <ImageIcon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Carousel Images</CardTitle>
                            <CardDescription>Images shown in the About section carousel (responsive on the site)</CardDescription>
                        </div>
                    </div>
                    <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddAboutImage} size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Image
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-navy-800 border-navy-700 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white">
                                    {editingAboutImage ? 'Edit Carousel Image' : 'Add Carousel Image'}
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {editingAboutImage ? 'Update image and label' : 'Add an image to the About section carousel'}
                                </DialogDescription>
                            </DialogHeader>
                            <AboutImageForm
                                image={editingAboutImage}
                                onSubmit={handleAboutFormSubmit}
                                onCancel={() => {
                                    setAboutDialogOpen(false);
                                    setEditingAboutImage(null);
                                }}
                                isLoading={aboutFormLoading}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <AboutImageList
                        images={aboutImages}
                        loading={aboutLoading}
                        onEdit={handleEditAboutImage}
                        onDelete={handleDeleteAboutImage}
                        onToggleActive={handleToggleAboutImageActive}
                        onReorder={handleReorder}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
