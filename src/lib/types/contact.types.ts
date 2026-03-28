export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: MessageStatus
  created_at: string
  updated_at: string
}

export interface UpdateMessageStatusInput {
  id: string
  status: MessageStatus
}

