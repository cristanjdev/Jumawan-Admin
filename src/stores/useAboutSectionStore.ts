import { create } from 'zustand';
import {
    AboutSectionImage,
    CreateAboutSectionImageInput,
    UpdateAboutSectionImageInput,
} from '@/lib/types/about.types';
import { aboutSectionService } from '@/lib/services/about-section.service';

interface AboutSectionState {
    images: AboutSectionImage[];
    loading: boolean;
    error: string | null;

    fetchImages: () => Promise<void>;
    createImage: (data: CreateAboutSectionImageInput) => Promise<AboutSectionImage>;
    updateImage: (data: UpdateAboutSectionImageInput) => Promise<AboutSectionImage>;
    deleteImage: (id: string) => Promise<void>;
    toggleActive: (id: string, is_active: boolean) => Promise<AboutSectionImage>;
    reorderImages: (items: { id: string; order_index: number }[]) => Promise<void>;
}

export const useAboutSectionStore = create<AboutSectionState>((set, get) => ({
    images: [],
    loading: false,
    error: null,

    fetchImages: async () => {
        try {
            set({ loading: true, error: null });
            const { data, error } = await aboutSectionService.getAll();
            if (error) {
                set({ error: 'Failed to fetch about section images', images: [] });
                return;
            }
            set({ images: data || [] });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to fetch about section images';
            set({ error: msg, images: [] });
        } finally {
            set({ loading: false });
        }
    },

    createImage: async (input) => {
        const newImage = await aboutSectionService.create(input);
        set((state) => ({ images: [...state.images, newImage].sort((a, b) => a.order_index - b.order_index) }));
        return newImage;
    },

    updateImage: async (data) => {
        const updated = await aboutSectionService.update(data);
        set((state) => ({
            images: state.images
                .map((img) => (img.id === updated.id ? updated : img))
                .sort((a, b) => a.order_index - b.order_index),
        }));
        return updated;
    },

    deleteImage: async (id) => {
        await aboutSectionService.delete(id);
        set((state) => ({ images: state.images.filter((img) => img.id !== id) }));
    },

    toggleActive: async (id, is_active) => {
        const updated = await aboutSectionService.toggleActive(id, is_active);
        set((state) => ({
            images: state.images
                .map((img) => (img.id === updated.id ? updated : img))
                .sort((a, b) => a.order_index - b.order_index),
        }));
        return updated;
    },

    reorderImages: async (items) => {
        await aboutSectionService.reorder(items);
        await get().fetchImages();
    },
}));
