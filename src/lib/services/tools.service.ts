import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

export interface Tool {
  id: string;
  name: string;
  icon_url: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateToolInput extends Omit<Tool, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateToolInput extends Partial<CreateToolInput> {
  id: string;
}

function mapTool(doc: any): Tool {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  }
}

export const toolsService = {
  async getAll(page = 1, limit = 20) {
    const all = await convexClient.query(api.tools.list, {})
    const mapped = (all || []).map(mapTool)
    const from = (page - 1) * limit
    const paged = mapped.slice(from, from + limit)
    return { data: paged, count: mapped.length }
  },

  async getById(id: string) {
    const doc = await convexClient.query(api.tools.getById, {
      id: id as Id<'tools'>,
    })
    if (!doc) throw new Error('Tool not found')
    return mapTool(doc)
  },

  async create(tool: CreateToolInput) {
    const id = await convexClient.mutation(api.tools.create, tool as any)
    const doc = await convexClient.query(api.tools.getById, { id })
    return mapTool(doc)
  },

  async update({ id, ...updates }: UpdateToolInput) {
    const doc = await convexClient.mutation(api.tools.update, {
      id: id as Id<'tools'>,
      ...updates,
    } as any)
    return mapTool(doc)
  },

  async delete(id: string) {
    await convexClient.mutation(api.tools.remove, {
      id: id as Id<'tools'>,
    })
  },

  async toggleActive(id: string, is_active: boolean) {
    const doc = await convexClient.mutation(api.tools.toggleActive, {
      id: id as Id<'tools'>,
      is_active,
    })
    return mapTool(doc)
  },
};
