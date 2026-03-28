import { useEffect } from 'react';
import { useAboutSectionStore } from '@/stores/useAboutSectionStore';

export function useAboutSection() {
    const store = useAboutSectionStore();

    useEffect(() => {
        store.fetchImages();
    }, []);

    return {
        images: store.images,
        loading: store.loading,
        error: store.error,
        createImage: store.createImage,
        updateImage: store.updateImage,
        deleteImage: store.deleteImage,
        toggleActive: store.toggleActive,
        reorderImages: store.reorderImages,
        refetch: store.fetchImages,
    };
}
