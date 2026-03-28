import { useEffect } from 'react';
import { useCertificateStore } from '@/stores/useCertificateStore';
import { CreateCertificateInput, UpdateCertificateInput } from '@/lib/types';

export const useCertificates = (page = 1, limit = 100) => {
  const store = useCertificateStore();

  useEffect(() => {
    store.fetchCertificates(page, limit);
    const unsubscribe = store.subscribeToChanges();
    return () => unsubscribe();
  }, [page, limit]);

  return {
    data: store.certificates,
    isLoading: store.loading,
    error: store.error,
    total: store.total,
    refetch: () => store.fetchCertificates(page, limit),
  };
};

export const useCertificate = (id: string) => {
  const store = useCertificateStore();
  const certificate = store.certificates.find(c => c.id === id);

  return {
    data: certificate,
    isLoading: store.loading,
  };
};

export const useCreateCertificate = () => {
  const store = useCertificateStore();
  return {
    mutateAsync: (data: CreateCertificateInput) => store.createCertificate(data),
    isLoading: store.loading
  };
};

export const useUpdateCertificate = () => {
  const store = useCertificateStore();
  return {
    mutateAsync: (data: UpdateCertificateInput) => store.updateCertificate(data),
    isLoading: store.loading
  };
};

export const useDeleteCertificate = () => {
  const store = useCertificateStore();
  return {
    mutateAsync: (id: string) => store.deleteCertificate(id),
    isLoading: store.loading
  };
};

