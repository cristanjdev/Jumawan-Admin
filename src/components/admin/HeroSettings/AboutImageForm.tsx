import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/FileUpload';
import { AboutSectionImage } from '@/lib/types/about.types';

interface AboutImageFormProps {
    image?: AboutSectionImage | null;
    onSubmit: (data: { image_url: string; label: string }) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export function AboutImageForm({ image, onSubmit, onCancel, isLoading }: AboutImageFormProps) {
    const [image_url, setImageUrl] = useState(image?.image_url ?? '');
    const [label, setLabel] = useState(image?.label ?? '');

    useEffect(() => {
        if (image) {
            setImageUrl(image.image_url);
            setLabel(image.label);
        } else {
            setImageUrl('');
            setLabel('');
        }
    }, [image]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image_url.trim()) return;
        await onSubmit({ image_url: image_url.trim(), label: label.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className="text-gray-300">Image</Label>
                <FileUpload
                    folder="about"
                    currentImage={image_url}
                    onUpload={setImageUrl}
                    onRemove={() => setImageUrl('')}
                    className="mt-2"
                />
            </div>
            <div>
                <Label htmlFor="about-label" className="text-gray-300">Label (e.g. Development, Design)</Label>
                <Input
                    id="about-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Development, Design, Innovation"
                    className="bg-navy-900/50 border-navy-600 text-white mt-2"
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="border-navy-600 text-gray-300">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !image_url.trim()}>
                    {isLoading ? 'Saving...' : image ? 'Update' : 'Add'}
                </Button>
            </div>
        </form>
    );
}
