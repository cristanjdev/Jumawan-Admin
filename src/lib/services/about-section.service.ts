import { convexClient } from '@/lib/convexClient';
import { api } from 'convex/_generated/api';
import {
    AboutSectionImage,
    CreateAboutSectionImageInput,
    UpdateAboutSectionImageInput,
} from '@/lib/types/about.types';
import { Id } from 'convex/_generated/dataModel';

function mapImage(doc: any): AboutSectionImage {
    return {
        ...doc,
        id: doc._id,
        created_at: new Date(doc._creationTime).toISOString(),
        updated_at: new Date(doc._creationTime).toISOString(),
    };
}

export const aboutSectionService = {
    async getAll() {
        try {
            const docs = await convexClient.query(api.aboutSectionImages.list, {});
            return { data: (docs || []).map(mapImage), error: null };
        } catch (err) {
            console.error('Error fetching about section images:', err);
            return { data: [] as AboutSectionImage[], error: err };
        }
    },

    async getActive() {
        try {
            const docs = await convexClient.query(api.aboutSectionImages.listActive, {});
            return { data: (docs || []).map(mapImage), error: null };
        } catch (err) {
            console.error('Error fetching active about section images:', err);
            return { data: [] as AboutSectionImage[], error: err };
        }
    },

    async create(input: CreateAboutSectionImageInput) {
        const id = await convexClient.mutation(api.aboutSectionImages.create, input as any);
        const docs = await convexClient.query(api.aboutSectionImages.list, {});
        const found = docs.find((d: any) => d._id === id);
        return mapImage(found || { _id: id, _creationTime: Date.now(), ...input });
    },

    async update({ id, ...updates }: UpdateAboutSectionImageInput) {
        const doc = await convexClient.mutation(api.aboutSectionImages.update, {
            id: id as Id<'about_section_images'>,
            ...updates,
        });
        return mapImage(doc);
    },

    async delete(id: string) {
        await convexClient.mutation(api.aboutSectionImages.remove, {
            id: id as Id<'about_section_images'>,
        });
    },

    async reorder(items: { id: string; order_index: number }[]) {
        await convexClient.mutation(api.aboutSectionImages.reorder, {
            items: items.map(i => ({
                id: i.id as Id<'about_section_images'>,
                order_index: i.order_index,
            })),
        });
    },

    async toggleActive(id: string, is_active: boolean) {
        const doc = await convexClient.mutation(api.aboutSectionImages.toggleActive, {
            id: id as Id<'about_section_images'>,
            is_active,
        });
        return mapImage(doc);
    },
};
