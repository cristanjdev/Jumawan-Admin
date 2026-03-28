import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Edit, Trash2, ExternalLink, Award, Calendar } from 'lucide-react'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { Certificate } from '../../types'

interface CertificateCardProps {
  certificate: Certificate
  onEdit: (certificate: Certificate) => void
  onDelete: (id: string) => void
}

export const CertificateCard = ({ certificate, onEdit, onDelete }: CertificateCardProps) => {
  return (
    <Card className="bg-navy-800 border-navy-700 hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {certificate.image_url && (
            <div className="flex-shrink-0">
              <OptimizedImage
                src={certificate.image_url}
                alt={certificate.title}
                className="w-20 h-20 object-cover rounded-lg border border-navy-600"
                fallbackIcon={<Award className="w-8 h-8 text-muted-foreground" />}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors mb-2">
                  {certificate.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-primary">{certificate.issuer}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </div>
                  <span>•</span>
                  <span>Order: {certificate.order_index}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(certificate)}
                  className="hover:bg-primary/10 hover:border-primary/30"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-500/10 hover:border-red-500/30">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-navy-800 border-navy-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Certificate</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to delete "{certificate.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(certificate.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            {certificate.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                {certificate.description}
              </p>
            )}

            {certificate.credential_id && (
              <div className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">Credential ID:</span> {certificate.credential_id}
              </div>
            )}

            {certificate.credential_url && (
              <Button size="sm" variant="outline" asChild className="hover:bg-primary/10 hover:border-primary/30">
                <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Verify Certificate
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

