import { create } from 'zustand';
import { Certificate, CreateCertificateInput, UpdateCertificateInput } from '@/lib/types';
import { certificateService } from '@/lib/services';

interface CertificateState {
    certificates: Certificate[];
    total: number;
    loading: boolean;
    error: string | null;

    fetchCertificates: (page?: number, limit?: number) => Promise<void>;
    createCertificate: (certificateData: CreateCertificateInput) => Promise<Certificate>;
    updateCertificate: (certificateData: UpdateCertificateInput) => Promise<Certificate>;
    deleteCertificate: (id: string) => Promise<void>;
    subscribeToChanges: () => () => void;
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
    certificates: [],
    total: 0,
    loading: false,
    error: null,

    fetchCertificates: async (page = 1, limit = 100) => {
        try {
            set({ loading: true, error: null });
            const { data, count } = await certificateService.getAll(page, limit);
            set({ certificates: data, total: count });
        } catch (err) {
            console.error('Error fetching certificates:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch certificates';
            set({ error: errorMessage, certificates: [], total: 0 });
        } finally {
            set({ loading: false });
        }
    },

    createCertificate: async (certificateData) => {
        try {
            const newCertificate = await certificateService.create(certificateData);
            set((state) => ({
                certificates: [...state.certificates, newCertificate],
                total: state.total + 1
            }));
            return newCertificate;
        } catch (err) {
            console.error('Error creating certificate:', err);
            throw err;
        }
    },

    updateCertificate: async (certificateData) => {
        try {
            const updatedCertificate = await certificateService.update(certificateData);
            set((state) => ({
                certificates: state.certificates.map((cert) =>
                    cert.id === updatedCertificate.id ? updatedCertificate : cert
                )
            }));
            return updatedCertificate;
        } catch (err) {
            console.error('Error updating certificate:', err);
            throw err;
        }
    },

    deleteCertificate: async (id) => {
        try {
            await certificateService.delete(id);
            set((state) => ({
                certificates: state.certificates.filter((cert) => cert.id !== id),
                total: state.total - 1
            }));
        } catch (err) {
            console.error('Error deleting certificate:', err);
            throw err;
        }
    },

    subscribeToChanges: () => {
        return () => {};
    },
}));
