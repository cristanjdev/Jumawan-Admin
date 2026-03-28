import { convexClient } from '@/lib/convexClient'
import { api } from 'convex/_generated/api'
import { ContactMessage, MessageStatus, UpdateMessageStatusInput } from '../types'
import { Id } from 'convex/_generated/dataModel'

function mapMessage(doc: any): ContactMessage {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  }
}

export const contactService = {
  async getAll(page = 1, limit = 10, statusFilter: MessageStatus | 'all' = 'all') {
    const all = await convexClient.query(api.contactMessages.list, {
      statusFilter: statusFilter === 'all' ? undefined : statusFilter,
    })
    const mapped = (all || []).map(mapMessage)
    const from = (page - 1) * limit
    const paged = mapped.slice(from, from + limit)
    return { data: paged, count: mapped.length }
  },

  async getById(id: string) {
    const doc = await convexClient.query(api.contactMessages.getById, {
      id: id as Id<'contact_messages'>,
    })
    if (!doc) throw new Error('Message not found')
    return mapMessage(doc)
  },

  async updateStatus({ id, status }: UpdateMessageStatusInput) {
    const doc = await convexClient.mutation(api.contactMessages.updateStatus, {
      id: id as Id<'contact_messages'>,
      status,
    })
    return mapMessage(doc)
  },

  async delete(id: string) {
    await convexClient.mutation(api.contactMessages.remove, {
      id: id as Id<'contact_messages'>,
    })
  },
}

