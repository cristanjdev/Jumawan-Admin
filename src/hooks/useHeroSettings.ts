import { useEffect } from 'react';
import { useHeroSettingsStore } from '@/stores/useHeroSettingsStore';

export function useHeroSettings() {
    const store = useHeroSettingsStore();

    useEffect(() => {
        store.fetchSettings();
        const unsubscribe = store.subscribeToChanges();
        return () => unsubscribe();
    }, []);

    return {
        settings: store.settings,
        badges: store.badges,
        resume: store.resume,
        profileImage: store.profileImage,
        hoverLogo: store.hoverLogo,
        portraitStyle: store.portraitStyle,
        depthMap: store.depthMap,
        loading: store.loading,
        error: store.error,
        createBadge: store.createBadge,
        updateSetting: store.updateSetting,
        deleteSetting: store.deleteSetting,
        toggleActive: store.toggleActive,
        reorderBadges: store.reorderBadges,
        updateResume: store.updateResume,
        updateProfileImage: store.updateProfileImage,
        updateHoverLogo: store.updateHoverLogo,
        updatePortraitStyle: store.updatePortraitStyle,
        updateDepthMap: store.updateDepthMap,
        refetch: store.fetchSettings,
    };
}

