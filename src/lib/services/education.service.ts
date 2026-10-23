import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { Education, CreateEducationInput, UpdateEducationInput } from '../types'
import { Id } from 'convex/_generated/dataModel'

function mapEducation(doc: any): Education {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  }
}

export const educationService = {
  async getAll() {
    const all = await convexClient.query(api.education.list, {})
    return (all || []).map(mapEducation)
  },

  async create(education: CreateEducationInput) {
    const id = await convexClient.mutation(api.education.create, education as any)
    const doc = await convexClient.query(api.education.getById, { id })
    return mapEducation(doc)
  },

  async update({ id, ...updates }: UpdateEducationInput) {
    const doc = await convexClient.mutation(api.education.update, {
      id: id as Id<'education'>,
      ...updates,
    } as any)
    return mapEducation(doc)
  },

  async delete(id: string) {
    await convexClient.mutation(api.education.remove, { id: id as Id<'education'> })
  },
}
