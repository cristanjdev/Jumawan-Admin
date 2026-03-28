import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, Search } from 'lucide-react'
import { MessageList } from '../components/Contact/MessageList'
import { useContactMessages, useUpdateMessageStatus, useDeleteMessage } from '../hooks/useContact'
import { useToast } from '@/hooks/use-toast'
import { MessageStatus } from '../types'

export const ContactPage = () => {
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: messagesData, isLoading } = useContactMessages(currentPage, itemsPerPage, statusFilter)
  const updateStatus = useUpdateMessageStatus()
  const deleteMessage = useDeleteMessage()
  const { toast } = useToast()

  const messages = messagesData?.data || []

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const handleStatusUpdate = async (id: string, status: MessageStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status })
      toast({
        title: 'Success',
        description: 'Message status updated'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage.mutateAsync(id)
      toast({
        title: 'Success',
        description: 'Message deleted successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
        <p className="text-muted-foreground">Manage contact form submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-navy-700 border-navy-600 text-white"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MessageStatus | 'all')}>
            <SelectTrigger className="w-48 bg-navy-700 border-navy-600 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-navy-800 border-navy-700">
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <MessageList
        messages={filteredMessages}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}

