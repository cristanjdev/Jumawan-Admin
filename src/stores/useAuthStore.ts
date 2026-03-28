import { create } from 'zustand';
import { convexClient } from '@/lib/convexClient';
import { api } from 'convex/_generated/api';

interface AdminUser {
    email: string;
}

interface AuthState {
    user: AdminUser | null;
    loading: boolean;
    isValidating: boolean;
    checkSession: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
}

const TOKEN_KEY = 'admin_session_token';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    isValidating: true,

    checkSession: async () => {
        try {
            set({ loading: true, isValidating: true });
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                set({ user: null });
                return;
            }
            const result = await convexClient.query(api.dashboard.validateSession, { token });
            if (result.valid && result.email) {
                set({ user: { email: result.email } });
            } else {
                localStorage.removeItem(TOKEN_KEY);
                set({ user: null });
            }
        } catch (error) {
            console.error('Error checking session:', error);
            localStorage.removeItem(TOKEN_KEY);
            set({ user: null });
        } finally {
            set({ loading: false, isValidating: false });
        }
    },

    signIn: async (email, password) => {
        try {
            set({ loading: true });
            const result = await convexClient.mutation(api.dashboard.login, {
                email,
                password,
            });

            if (!result.success) {
                return { success: false, error: result.error || 'Invalid credentials' };
            }

            if (result.token) {
                localStorage.setItem(TOKEN_KEY, result.token);
                set({ user: { email: result.email! } });
                return { success: true };
            }

            return { success: false, error: 'Login failed' };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: 'An error occurred during sign in' };
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                await convexClient.mutation(api.dashboard.logout, { token });
                localStorage.removeItem(TOKEN_KEY);
            }
            set({ user: null });
        } catch (error) {
            console.error('Sign out error:', error);
            localStorage.removeItem(TOKEN_KEY);
            set({ user: null });
        }
    },
}));
