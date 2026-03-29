import { create } from 'zustand';
import { HeroSetting, CreateHeroBadgeInput, UpdateHeroSettingInput } from '@/lib/types/hero.types';
import { heroService } from '@/lib/services/hero.service';

interface HeroSettingsState {
    settings: HeroSetting[];
    badges: HeroSetting[];
    resume: HeroSetting | null;
    profileImage: HeroSetting | null;
    hoverLogo: HeroSetting | null;
    loading: boolean;
    error: string | null;

    fetchSettings: () => Promise<void>;
    createBadge: (data: Omit<CreateHeroBadgeInput, 'type'>) => Promise<HeroSetting>;
    updateSetting: (data: UpdateHeroSettingInput) => Promise<HeroSetting>;
    deleteSetting: (id: string) => Promise<void>;
    toggleActive: (id: string, is_active: boolean) => Promise<HeroSetting>;
    reorderBadges: (items: { id: string; order_index: number }[]) => Promise<void>;
    updateResume: (url: string) => Promise<HeroSetting>;
    updateProfileImage: (url: string) => Promise<HeroSetting>;
    updateHoverLogo: (url: string) => Promise<HeroSetting>;
    subscribeToChanges: () => () => void;
}

export const useHeroSettingsStore = create<HeroSettingsState>((set, get) => ({
    settings: [],
    badges: [],
    resume: null,
    profileImage: null,
    hoverLogo: null,
    loading: false,
    error: null,

    fetchSettings: async () => {
        try {
            set({ loading: true, error: null });
            const { data, error } = await heroService.getAll();

            if (error) {
                set({ error: 'Failed to fetch hero settings', settings: [], badges: [], resume: null, profileImage: null, hoverLogo: null });
                return;
            }

            const badges = data.filter(s => s.type === 'badge');
            const resume = data.find(s => s.type === 'resume') || null;
            const profileImage = data.find(s => s.type === 'profile_image') || null;
            const hoverLogo = data.find(s => s.type === 'hover_logo') || null;

            set({ settings: data, badges, resume, profileImage, hoverLogo });
        } catch (err) {
            console.error('Error fetching hero settings:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hero settings';
            set({ error: errorMessage, settings: [], badges: [], resume: null, profileImage: null, hoverLogo: null });
        } finally {
            set({ loading: false });
        }
    },

    createBadge: async (data) => {
        try {
            const badgeData: CreateHeroBadgeInput = { ...data, type: 'badge' };
            const newBadge = await heroService.create(badgeData);
            set((state) => ({
                settings: [...state.settings, newBadge],
                badges: [...state.badges, newBadge],
            }));
            return newBadge;
        } catch (err) {
            console.error('Error creating badge:', err);
            throw err;
        }
    },

    updateSetting: async (data) => {
        try {
            const updated = await heroService.update(data);
            set((state) => {
                const newSettings = state.settings.map(s => s.id === updated.id ? updated : s);
                return {
                    settings: newSettings,
                    badges: newSettings.filter(s => s.type === 'badge'),
                    resume: newSettings.find(s => s.type === 'resume') || null,
                    profileImage: newSettings.find(s => s.type === 'profile_image') || null,
                    hoverLogo: newSettings.find(s => s.type === 'hover_logo') || null,
                };
            });
            return updated;
        } catch (err) {
            console.error('Error updating setting:', err);
            throw err;
        }
    },

    deleteSetting: async (id) => {
        try {
            await heroService.delete(id);
            set((state) => {
                const newSettings = state.settings.filter(s => s.id !== id);
                return {
                    settings: newSettings,
                    badges: newSettings.filter(s => s.type === 'badge'),
                    resume: newSettings.find(s => s.type === 'resume') || null,
                    profileImage: newSettings.find(s => s.type === 'profile_image') || null,
                    hoverLogo: newSettings.find(s => s.type === 'hover_logo') || null,
                };
            });
        } catch (err) {
            console.error('Error deleting setting:', err);
            throw err;
        }
    },

    toggleActive: async (id, is_active) => {
        try {
            const updated = await heroService.toggleActive(id, is_active);
            set((state) => {
                const newSettings = state.settings.map(s => s.id === updated.id ? updated : s);
                return {
                    settings: newSettings,
                    badges: newSettings.filter(s => s.type === 'badge'),
                    resume: newSettings.find(s => s.type === 'resume') || null,
                    profileImage: newSettings.find(s => s.type === 'profile_image') || null,
                    hoverLogo: newSettings.find(s => s.type === 'hover_logo') || null,
                };
            });
            return updated;
        } catch (err) {
            console.error('Error toggling active:', err);
            throw err;
        }
    },

    reorderBadges: async (items) => {
        try {
            const currentBadges = [...get().badges];
            const newBadges = [...currentBadges];

            items.forEach(({ id, order_index }) => {
                const badge = newBadges.find(b => b.id === id);
                if (badge) badge.order_index = order_index;
            });
            newBadges.sort((a, b) => a.order_index - b.order_index);

            set((state) => ({
                badges: newBadges,
                settings: [...state.settings.filter(s => s.type !== 'badge'), ...newBadges],
            }));

            await heroService.reorder(items);
        } catch (err) {
            console.error('Error reordering badges:', err);
            throw err;
        }
    },

    updateResume: async (url) => {
        try {
            const updated = await heroService.updateResume(url);
            set((state) => {
                const existingResume = state.settings.find(s => s.type === 'resume');
                let newSettings: HeroSetting[];

                if (existingResume) {
                    newSettings = state.settings.map(s => s.id === updated.id ? updated : s);
                } else {
                    newSettings = [...state.settings, updated];
                }

                return {
                    settings: newSettings,
                    badges: newSettings.filter(s => s.type === 'badge'),
                    resume: updated,
                    profileImage: newSettings.find(s => s.type === 'profile_image') || null,
                    hoverLogo: newSettings.find(s => s.type === 'hover_logo') || null,
                };
            });
            return updated;
        } catch (err) {
            console.error('Error updating resume:', err);
            throw err;
        }
    },

    updateProfileImage: async (url) => {
        try {
            const updated = await heroService.updateProfileImage(url);
            set((state) => {
                const existingProfileImage = state.settings.find(s => s.type === 'profile_image');
                let newSettings: HeroSetting[];

                if (existingProfileImage) {
                    newSettings = state.settings.map(s => s.id === updated.id ? updated : s);
                } else {
                    newSettings = [...state.settings, updated];
                }

                return {
                    settings: newSettings,
                    badges: newSettings.filter(s => s.type === 'badge'),
                    resume: newSettings.find(s => s.type === 'resume') || null,
                    profileImage: updated,
                    hoverLogo: newSettings.find(s => s.type === 'hover_logo') || null,
                };
            });
            return updated;
        } catch (err) {
            console.error('Error updating profile image:', err);
            throw err;
        }
    },

    updateHoverLogo: async (url) => {
        try {
            const updated = await heroService.updateHoverLogo(url);
            set((state) => {
                const existing = state.settings.find(s => s.type === 'hover_logo');
                let newSettings: HeroSetting[];

                if (existing) {
                    newSettings = state.settings.map(s => s.id === updated.id ? updated : s);
                } else {
                    newSettings = [...state.settings, updated];
                }

                return {
                    settings: newSettings,
                    badges: newSettings.filter(s => s.type === 'badge'),
                    resume: newSettings.find(s => s.type === 'resume') || null,
                    profileImage: newSettings.find(s => s.type === 'profile_image') || null,
                    hoverLogo: updated,
                };
            });
            return updated;
        } catch (err) {
            console.error('Error updating hover logo:', err);
            throw err;
        }
    },

    subscribeToChanges: () => {
        // No polling needed — store state is updated directly by mutations
        return () => {};
    },
}));

