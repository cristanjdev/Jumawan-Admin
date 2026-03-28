import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Mail, MailOpen, Reply, Archive } from 'lucide-react'
import { ContactMessage, MessageStatus } from '@/lib/types'

interface MessageCardProps {
  message: ContactMessage
  onStatusUpdate: (id: string, status: MessageStatus) => void
  onDelete: (id: string) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread': return 'bg-red-500'
    case 'read': return 'bg-blue-500'
    case 'replied': return 'bg-green-500'
    case 'archived': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'unread': return <Mail className="w-4 h-4" />
    case 'read': return <MailOpen className="w-4 h-4" />
    case 'replied': return <Reply className="w-4 h-4" />
    case 'archived': return <Archive className="w-4 h-4" />
    default: return <Mail className="w-4 h-4" />
  }
}

export const MessageCard = ({ message, onStatusUpdate, onDelete }: MessageCardProps) => {
  return (
    <Card className="bg-navy-800 border-navy-700 hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors">
                {message.name}
              </h3>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getStatusColor(message.status)} flex items-center gap-1`}
              >
                {getStatusIcon(message.status)}
                {message.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <span>{message.email}</span>
              {message.subject && (
                <>
                  <span>•</span>
                  <span className="font-medium text-gray-200">{message.subject}</span>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleString()}
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-500/10 hover:border-red-500/30">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-navy-800 border-navy-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Are you sure you want to delete this message from {message.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(message.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <p className="text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">
          {message.message}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {message.status === 'unread' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(message.id, 'read')}
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              <MailOpen className="w-3 h-3 mr-1" />
              Mark as Read
            </Button>
          )}
          
          {message.status === 'read' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(message.id, 'replied')}
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              <Reply className="w-3 h-3 mr-1" />
              Mark as Replied
            </Button>
          )}
          
          {message.status !== 'archived' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(message.id, 'archived')}
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              <Archive className="w-3 h-3 mr-1" />
              Archive
            </Button>
          )}
          
          {message.status === 'archived' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusUpdate(message.id, 'read')}
              className="hover:bg-primary/10 hover:border-primary/30"
            >
              <MailOpen className="w-3 h-3 mr-1" />
              Unarchive
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            asChild
            className="hover:bg-primary/10 hover:border-primary/30"
          >
            <a href={`mailto:${message.email}${message.subject ? `?subject=Re: ${message.subject}` : ''}`}>
              <Mail className="w-3 h-3 mr-1" />
              Reply
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

