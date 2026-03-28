import { MessageCard } from './MessageCard'
import { ContactMessage, MessageStatus } from '@/lib/types'
import { Mail } from 'lucide-react'

interface MessageListProps {
  messages: ContactMessage[]
  onStatusUpdate: (id: string, status: MessageStatus) => void
  onDelete: (id: string) => void
}

export const MessageList = ({ messages, onStatusUpdate, onDelete }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No messages found</h3>
        <p className="text-muted-foreground">No contact messages yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

