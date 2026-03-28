import { convexClient } from '@/lib/convexClient';
import { api } from 'convex/_generated/api';
import { Certificate, CreateCertificateInput, UpdateCertificateInput } from '../types';

function mapCertificate(doc: any): Certificate {
  return {
    ...doc,
    id: doc._id,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: new Date(doc._creationTime).toISOString(),
  };
}

export const certificateService = {
  async getAll(_page = 1, _limit = 10) {
    const data = await convexClient.query(api.certificates.list);
    const mapped = (data || []).map(mapCertificate);
    return { data: mapped, count: mapped.length };
  },

  async getById(id: string) {
    const data = await convexClient.query(api.certificates.getById, { id: id as any });
    if (!data) throw new Error('Certificate not found');
    return mapCertificate(data);
  },

  async create(certificate: CreateCertificateInput) {
    const id = await convexClient.mutation(api.certificates.create, {
      title: certificate.title,
      issuer: certificate.issuer,
      issue_date: certificate.issue_date,
      credential_id: certificate.credential_id,
      credential_url: certificate.credential_url,
      image_url: certificate.image_url,
      description: certificate.description,
      order_index: certificate.order_index,
      type: certificate.type,
    });
    return { id, ...certificate, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Certificate;
  },

  async update({ id, ...updates }: UpdateCertificateInput) {
    await convexClient.mutation(api.certificates.update, { id: id as any, ...updates });
    return await this.getById(id);
  },

  async delete(id: string) {
    await convexClient.mutation(api.certificates.remove, { id: id as any });
  },
};

