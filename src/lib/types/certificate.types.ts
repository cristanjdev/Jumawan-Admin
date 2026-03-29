export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_id?: string
  credential_url?: string
  verification_image_url?: string
  image_url?: string
  description?: string
  order_index: number
  type: 'participation' | 'recognition'
  created_at: string
  updated_at: string
}

export interface CertificateFormData {
  title: string
  issuer: string
  issue_date: string
  credential_id: string
  credential_url: string
  verification_image_url: string
  image_url: string
  description: string
  order_index: number
  type: 'participation' | 'recognition'
}

export interface CreateCertificateInput extends Omit<Certificate, 'id' | 'created_at' | 'updated_at'> { }

export interface UpdateCertificateInput extends Partial<CreateCertificateInput> {
  id: string
}

