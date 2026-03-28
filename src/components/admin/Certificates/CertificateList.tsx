import { CertificateCard } from './CertificateCard'
import { Certificate } from '@/lib/types'
import { Award } from 'lucide-react'

interface CertificateListProps {
  certificates: Certificate[]
  onEdit: (certificate: Certificate) => void
  onDelete: (id: string) => void
}

export const CertificateList = ({ certificates, onEdit, onDelete }: CertificateListProps) => {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No certificates yet</h3>
        <p className="text-muted-foreground">Get started by adding your first certificate</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

