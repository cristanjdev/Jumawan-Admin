import { useAuthStore } from '@/stores/useAuthStore';

// Re-exporting useAuth from the store to maintain backward compatibility
// where possible, but encouraging direct use of the store.
export const useAuth = () => {
  const { user, loading, signIn, signOut } = useAuthStore();
  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
};

// Deprecated: AuthProvider is no longer needed with Zustand
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
