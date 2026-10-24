import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Plus, FileText, Tag, User, ImageIcon, Sparkles, Layers } from 'lucide-react';
import { HeroBadgeList } from '@/components/admin/HeroSettings/HeroBadgeList';
import { HeroBadgeForm } from '@/components/admin/HeroSettings/HeroBadgeForm';
import { PortraitStylePicker } from '@/components/admin/HeroSettings/PortraitStylePicker';
import { DEFAULT_PORTRAIT_STYLE, PORTRAIT_STYLES, isPortraitStyle, type PortraitStyle } from '@/lib/portrait-styles';
import { AboutImageList } from '@/components/admin/HeroSettings/AboutImageList';
import { AboutImageForm } from '@/components/admin/HeroSettings/AboutImageForm';
import { FileUpload } from '@/components/ui/FileUpload';
import { ResumeUpload } from '@/components/ui/ResumeUpload';
import { useHeroSettings } from '@/hooks/useHeroSettings';
import { useAboutSection } from '@/hooks/useAboutSection';
import { HeroSetting, HeroBadgeFormData } from '@/lib/types/hero.types';
import { AboutSectionImage } from '@/lib/types/about.types';
import { useToast } from '@/hooks/use-toast';

export function HeroSettingsPage() {
    const {
        badges,
        resume,
        profileImage,
        hoverLogo,
        portraitStyle,
        depthMap,
        loading,
        error,
        createBadge,
        updateSetting,
        deleteSetting,
        toggleActive,
        updateResume,
        updateProfileImage,
        updateHoverLogo,
        updatePortraitStyle,
        updateDepthMap,
    } = useHeroSettings();

    const {
        images: aboutImages,
        loading: aboutLoading,
        createImage: createAboutImage,
        updateImage: updateAboutImage,
        deleteImage: deleteAboutImage,
        toggleActive: toggleAboutImageActive,
        reorderImages: reorderAboutImages,
    } = useAboutSection();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<HeroSetting | null>(null);
    const [editingAboutImage, setEditingAboutImage] = useState<AboutSectionImage | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [aboutFormLoading, setAboutFormLoading] = useState(false);
    const [savingStyle, setSavingStyle] = useState<PortraitStyle | null>(null);
    const { toast } = useToast();
    const currentStyle = isPortraitStyle(portraitStyle?.value) ? portraitStyle.value : DEFAULT_PORTRAIT_STYLE;

    // Show error message if table doesn't exist
    if (error && !loading) {
        return (
            <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Database Setup Required</h2>
                    <p className="text-red-400 mb-4">
                        The hero_settings table doesn't exist in your database yet. Please run the migration to create it.
                    </p>
                    <div className="bg-navy-800 rounded p-4 border border-red-500/20">
                        <p className="text-sm font-semibold text-gray-300 mb-2">Steps to fix:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                            <li>Ensure Convex is running (<code className="bg-navy-900 px-2 py-1 rounded">npx convex dev</code>)</li>
                            <li>Verify the hero_settings table exists in the Convex schema</li>
                            <li>Refresh this page</li>
                        </ol>
                    </div>
                    <p className="text-sm text-red-400 mt-4">Error: {error}</p>
                </div>
            </div>
        );
    }

    const handleAddBadge = () => {
        setEditingBadge(null);
        setIsDialogOpen(true);
    };

    const handleEditBadge = (badge: HeroSetting) => {
        setEditingBadge(badge);
        setIsDialogOpen(true);
    };

    const handleDeleteBadge = async (id: string) => {
        try {
            await deleteSetting(id);
            toast({
                title: 'Success',
                description: 'Badge deleted successfully',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to delete badge',
                variant: 'destructive',
            });
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await toggleActive(id, isActive);
            toast({
                title: 'Success',
                description: `Badge ${isActive ? 'activated' : 'deactivated'} successfully`,
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to update badge status',
                variant: 'destructive',
            });
        }
    };

    const handleFormSubmit = async (data: HeroBadgeFormData) => {
        setFormLoading(true);
        try {
            if (editingBadge) {
                await updateSetting({ id: editingBadge.id, ...data });
                toast({
                    title: 'Success',
                    description: 'Badge updated successfully',
                });
            } else {
                await createBadge(data);
                toast({
                    title: 'Success',
                    description: 'Badge created successfully',
                });
            }
            setIsDialogOpen(false);
            setEditingBadge(null);
        } catch {
            toast({
                title: 'Error',
                description: `Failed to ${editingBadge ? 'update' : 'create'} badge`,
                variant: 'destructive',
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleFormCancel = () => {
        setIsDialogOpen(false);
        setEditingBadge(null);
    };

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

    const handleReorderAboutImages = async (items: { id: string; order_index: number }[]) => {
        try {
            await reorderAboutImages(items);
            toast({ title: 'Success', description: 'Carousel order updated' });
        } catch {
            toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
        }
    };

    const handleProfileImageUpload = async (url: string) => {
        try {
            await updateProfileImage(url);
            toast({
                title: 'Success',
                description: 'Profile image updated successfully',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save profile image',
                variant: 'destructive',
            });
        }
    };

    const handleProfileImageRemove = async () => {
        try {
            await updateProfileImage('');
            toast({
                title: 'Removed',
                description: 'Profile image removed',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to remove profile image',
                variant: 'destructive',
            });
        }
    };

    const handleResumeUpload = async (url: string) => {
        try {
            await updateResume(url);
            toast({
                title: 'Success',
                description: 'Resume file updated successfully',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save resume file',
                variant: 'destructive',
            });
        }
    };

    const handleResumeRemove = async () => {
        try {
            await updateResume('');
            toast({
                title: 'Removed',
                description: 'Resume file removed',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to remove resume file',
                variant: 'destructive',
            });
        }
    };

    const handleHoverLogoUpload = async (url: string) => {
        try {
            await updateHoverLogo(url);
            toast({
                title: 'Success',
                description: 'Hover logo updated successfully',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save hover logo',
                variant: 'destructive',
            });
        }
    };

    const handleHoverLogoRemove = async () => {
        try {
            await updateHoverLogo('');
            toast({
                title: 'Removed',
                description: 'Hover logo removed',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to remove hover logo',
                variant: 'destructive',
            });
        }
    };

    const handlePortraitStyleChange = async (style: PortraitStyle) => {
        setSavingStyle(style);
        try {
            await updatePortraitStyle(style);
            toast({
                title: 'Portrait style updated',
                description: `The portfolio now shows: ${PORTRAIT_STYLES.find(s => s.id === style)?.name}`,
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save portrait style',
                variant: 'destructive',
            });
        } finally {
            setSavingStyle(null);
        }
    };

    const handleDepthMapUpload = async (url: string) => {
        try {
            await updateDepthMap(url);
            toast({
                title: 'Success',
                description: 'Depth map updated successfully',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save depth map',
                variant: 'destructive',
            });
        }
    };

    const handleDepthMapRemove = async () => {
        try {
            await updateDepthMap('');
            toast({
                title: 'Removed',
                description: 'Depth map removed',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to remove depth map',
                variant: 'destructive',
            });
        }
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
            {/* Header */}
            <div className="flex justify-between items-center bg-navy-800 p-6 rounded-lg border border-navy-700">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hero Settings</h1>
                    <p className="text-muted-foreground">Manage hero section profile, badges, and resume download</p>
                </div>
            </div>

            {/* Profile Image & Resume - Side by Side */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Profile Image Section */}
                <Card className="bg-navy-800 border-navy-700">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <User className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Profile Avatar</CardTitle>
                                <CardDescription>Upload your profile picture for the hero section</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FileUpload
                            folder="hero"
                            currentImage={profileImage?.value}
                            onUpload={handleProfileImageUpload}
                            onRemove={handleProfileImageRemove}
                        />
                    </CardContent>
                </Card>

                {/* Hover Logo Section */}
                <Card className="bg-navy-800 border-navy-700">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <ImageIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Brand Logo</CardTitle>
                                <CardDescription>Your logo (e.g. BluTech), used on the coin's back and the ID badge portrait styles</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FileUpload
                            folder="hero"
                            currentImage={hoverLogo?.value}
                            onUpload={handleHoverLogoUpload}
                            onRemove={handleHoverLogoRemove}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Portrait Style */}
            <Card className="bg-navy-800 border-navy-700">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Portrait Style</CardTitle>
                            <CardDescription>
                                The 3D design of your photo in the hero. Changes show on the live site right away.
                                To preview one first, open the portfolio with <code className="bg-navy-900 px-1.5 py-0.5 rounded">?portrait=coin</code> (or any style id).
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <PortraitStylePicker value={currentStyle} onChange={handlePortraitStyleChange} saving={savingStyle} />
                </CardContent>
            </Card>

            {/* Resume and depth map */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-navy-800 border-navy-700">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <FileText className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Resume Download</CardTitle>
                                <CardDescription>Upload your resume file for visitors to download</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResumeUpload
                            currentFile={resume?.value}
                            onUpload={handleResumeUpload}
                            onRemove={handleResumeRemove}
                            label="Resume / CV File"
                        />
                    </CardContent>
                </Card>

                {/* Depth map for the "3D photo" style */}
                <Card className="bg-navy-800 border-navy-700">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10">
                                <Layers className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Depth Map</CardTitle>
                                <CardDescription>
                                    For the "3D photo" style: a grayscale image of your profile photo where near is white and far is black,
                                    the same size as the photo. Make one with any free depth-map tool (e.g. Depth Anything). Without it, that
                                    style uses a gentle built-in depth.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FileUpload
                            folder="hero"
                            currentImage={depthMap?.value}
                            onUpload={handleDepthMapUpload}
                            onRemove={handleDepthMapRemove}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Badges Section - Full Width */}
            <Card className="bg-navy-800 border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10">
                            <Tag className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Role Badges</CardTitle>
                            <CardDescription>Badges displayed below your name in the hero section</CardDescription>
                        </div>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddBadge} size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Badge
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-navy-800 border-navy-700 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white">
                                    {editingBadge ? 'Edit Badge' : 'Add New Badge'}
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {editingBadge ? 'Update badge details' : 'Add a new role badge to your hero section'}
                                </DialogDescription>
                            </DialogHeader>
                            <HeroBadgeForm
                                badge={editingBadge || undefined}
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                                isLoading={formLoading}
                                nextOrderIndex={badges.length}
                            />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <HeroBadgeList
                        badges={badges}
                        loading={loading}
                        onEdit={handleEditBadge}
                        onDelete={handleDeleteBadge}
                        onToggleActive={handleToggleActive}
                    />
                </CardContent>
            </Card>

            {/* About Section Carousel */}
            <Card className="bg-navy-800 border-navy-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <ImageIcon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white">About Section Carousel</CardTitle>
                            <CardDescription>Images shown in the About section carousel on the portfolio (responsive)</CardDescription>
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
                                onCancel={() => { setAboutDialogOpen(false); setEditingAboutImage(null); }}
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
                        onReorder={handleReorderAboutImages}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
