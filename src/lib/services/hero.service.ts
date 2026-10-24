import { convexClient } from '@/lib/convexClient';
import { api } from 'convex/_generated/api';
import { HeroSetting, CreateHeroBadgeInput, CreateHeroResumeInput, CreateHeroProfileImageInput, UpdateHeroSettingInput } from '@/lib/types/hero.types';
import { Id } from 'convex/_generated/dataModel';
import type { PortraitStyle } from '@/lib/portrait-styles';

function mapHero(doc: any): HeroSetting {
    return {
        ...doc,
        id: doc._id,
        created_at: new Date(doc._creationTime).toISOString(),
        updated_at: new Date(doc._creationTime).toISOString(),
    };
}

export const heroService = {
    async getAll() {
        try {
            const docs = await convexClient.query(api.heroSettings.list, {});
            return { data: (docs || []).map(mapHero), error: null };
        } catch (err) {
            console.error('Error fetching hero settings:', err);
            return { data: [] as HeroSetting[], error: err };
        }
    },

    async getBadges() {
        try {
            const docs = await convexClient.query(api.heroSettings.getByType, { type: 'badge' });
            return { data: (docs || []).map(mapHero), error: null };
        } catch (err) {
            console.error('Error fetching badges:', err);
            return { data: [] as HeroSetting[], error: err };
        }
    },

    async getResume() {
        try {
            const docs = await convexClient.query(api.heroSettings.getByType, { type: 'resume' });
            const mapped = (docs || []).map(mapHero);
            return { data: mapped[0] || null, error: null };
        } catch (err) {
            console.error('Error fetching resume:', err);
            return { data: null, error: err };
        }
    },

    async getProfileImage() {
        try {
            const docs = await convexClient.query(api.heroSettings.getByType, { type: 'profile_image' });
            const mapped = (docs || []).map(mapHero);
            return { data: mapped[0] || null, error: null };
        } catch (err) {
            console.error('Error fetching profile image:', err);
            return { data: null, error: err };
        }
    },

    async create(input: CreateHeroBadgeInput | CreateHeroResumeInput | CreateHeroProfileImageInput) {
        const id = await convexClient.mutation(api.heroSettings.create, {
            type: input.type,
            value: input.value,
            order_index: ('order_index' in input ? input.order_index : 0) ?? 0,
            is_active: input.is_active ?? true,
        });
        const doc = await convexClient.query(api.heroSettings.list, {});
        const found = doc.find((d: any) => d._id === id);
        return mapHero(found || { _id: id, _creationTime: Date.now(), ...input });
    },

    async update({ id, ...updates }: UpdateHeroSettingInput) {
        const doc = await convexClient.mutation(api.heroSettings.update, {
            id: id as Id<'hero_settings'>,
            ...updates,
        });
        return mapHero(doc);
    },

    async delete(id: string) {
        await convexClient.mutation(api.heroSettings.remove, {
            id: id as Id<'hero_settings'>,
        });
    },

    async reorder(items: { id: string; order_index: number }[]) {
        await convexClient.mutation(api.heroSettings.reorder, {
            items: items.map(i => ({
                id: i.id as Id<'hero_settings'>,
                order_index: i.order_index,
            })),
        });
    },

    async toggleActive(id: string, is_active: boolean) {
        const doc = await convexClient.mutation(api.heroSettings.toggleActive, {
            id: id as Id<'hero_settings'>,
            is_active,
        });
        return mapHero(doc);
    },

    async updateResume(url: string) {
        const doc = await convexClient.mutation(api.heroSettings.updateResume, { url });
        return mapHero(doc);
    },

    async updateProfileImage(url: string) {
        const doc = await convexClient.mutation(api.heroSettings.updateProfileImage, { url });
        return mapHero(doc);
    },

    async updateHoverLogo(url: string) {
        const doc = await convexClient.mutation(api.heroSettings.updateHoverLogo, { url });
        return mapHero(doc);
    },

    async updatePortraitStyle(style: PortraitStyle) {
        const doc = await convexClient.mutation(api.heroSettings.updatePortraitStyle, { style });
        return mapHero(doc);
    },

    async updateDepthMap(url: string) {
        const doc = await convexClient.mutation(api.heroSettings.updateDepthMap, { url });
        return mapHero(doc);
    },
};

