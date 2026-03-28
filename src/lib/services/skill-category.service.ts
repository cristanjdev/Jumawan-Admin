import { convexClient } from '@/lib/convexClient';
import { api } from 'convex/_generated/api';
import {
    SkillCategory,
    CreateSkillCategoryInput,
    UpdateSkillCategoryInput,
} from '@/lib/types/skill.types';
import { Id } from 'convex/_generated/dataModel';

function mapCategory(doc: any): SkillCategory {
    return {
        ...doc,
        id: doc._id,
        created_at: new Date(doc._creationTime).toISOString(),
        updated_at: new Date(doc._creationTime).toISOString(),
    };
}

export const skillCategoryService = {
    async getAll() {
        try {
            const docs = await convexClient.query(api.skillCategories.list, {});
            return { data: (docs || []).map(mapCategory), error: null };
        } catch (err) {
            console.error('Error fetching skill categories:', err);
            return { data: [] as SkillCategory[], error: err };
        }
    },

    async create(input: CreateSkillCategoryInput) {
        const id = await convexClient.mutation(api.skillCategories.create, input as any);
        const docs = await convexClient.query(api.skillCategories.list, {});
        const found = docs.find((d: any) => d._id === id);
        return mapCategory(found || { _id: id, _creationTime: Date.now(), ...input });
    },

    async update({ id, ...updates }: UpdateSkillCategoryInput) {
        const doc = await convexClient.mutation(api.skillCategories.update, {
            id: id as Id<'skill_categories'>,
            ...updates,
        });
        return mapCategory(doc);
    },

    async delete(id: string) {
        await convexClient.mutation(api.skillCategories.remove, {
            id: id as Id<'skill_categories'>,
        });
    },

    async reorder(items: { id: string; order_index: number }[]) {
        await convexClient.mutation(api.skillCategories.reorder, {
            items: items.map(i => ({
                id: i.id as Id<'skill_categories'>,
                order_index: i.order_index,
            })),
        });
    },

    async toggleActive(id: string, is_active: boolean) {
        const doc = await convexClient.mutation(api.skillCategories.toggleActive, {
            id: id as Id<'skill_categories'>,
            is_active,
        });
        return mapCategory(doc);
    },
};
