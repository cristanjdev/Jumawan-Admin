export interface HeroSetting {
    id: string;
    type: 'badge' | 'resume' | 'profile_image';
    value: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface HeroBadge extends HeroSetting {
    type: 'badge';
}

export interface HeroResume extends HeroSetting {
    type: 'resume';
}

export interface HeroProfileImage extends HeroSetting {
    type: 'profile_image';
}

export interface CreateHeroBadgeInput {
    type: 'badge';
    value: string;
    order_index: number;
    is_active?: boolean;
}

export interface CreateHeroResumeInput {
    type: 'resume';
    value: string;
    order_index?: number;
    is_active?: boolean;
}

export interface CreateHeroProfileImageInput {
    type: 'profile_image';
    value: string;
    order_index?: number;
    is_active?: boolean;
}

export interface UpdateHeroSettingInput {
    id: string;
    value?: string;
    order_index?: number;
    is_active?: boolean;
}

export type HeroBadgeFormData = Omit<CreateHeroBadgeInput, 'type'>;

