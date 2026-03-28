import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare } from 'lucide-react'
import { ContactMessage } from '../../types'

interface RecentMessagesProps {
  messages: ContactMessage[]
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

export const RecentMessages = ({ messages }: RecentMessagesProps) => {
  return (
    <Card className="bg-navy-800 border-navy-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Messages</CardTitle>
        <CardDescription>Latest contact form submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">Contact form submissions will appear here</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="group p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-all duration-200 border border-navy-600 hover:border-primary/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                        {message.name}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(message.status)}`}
                      >
                        {message.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{message.email}</p>
                    {message.subject && (
                      <p className="text-sm font-medium text-gray-200 mb-2">{message.subject}</p>
                    )}
                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                      {message.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-3">
                      <span>{new Date(message.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

