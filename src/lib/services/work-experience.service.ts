import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { WorkExperience, CreateWorkExperienceInput, UpdateWorkExperienceInput } from '../types'
import { Id } from 'convex/_generated/dataModel'

function mapExperience(doc: any): WorkExperience {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  }
}

export const workExperienceService = {
  async getAll(page = 1, limit = 10) {
    const all = await convexClient.query(api.workExperience.list, {})
    const mapped = (all || []).map(mapExperience)
    const from = (page - 1) * limit
    const paged = mapped.slice(from, from + limit)
    return { data: paged, count: mapped.length }
  },

  async getById(id: string) {
    const doc = await convexClient.query(api.workExperience.getById, {
      id: id as Id<'work_experience'>,
    })
    if (!doc) throw new Error('Work experience not found')
    return mapExperience(doc)
  },

  async create(experience: CreateWorkExperienceInput) {
    const id = await convexClient.mutation(api.workExperience.create, experience as any)
    const doc = await convexClient.query(api.workExperience.getById, { id })
    return mapExperience(doc)
  },

  async update({ id, ...updates }: UpdateWorkExperienceInput) {
    const doc = await convexClient.mutation(api.workExperience.update, {
      id: id as Id<'work_experience'>,
      ...updates,
    } as any)
    return mapExperience(doc)
  },

  async delete(id: string) {
    await convexClient.mutation(api.workExperience.remove, {
      id: id as Id<'work_experience'>,
    })
  },
}

