export interface AboutSectionImage {
    id: string;
    image_url: string;
    label: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateAboutSectionImageInput {
    image_url: string;
    label: string;
    order_index?: number;
    is_active?: boolean;
}

export interface UpdateAboutSectionImageInput {
    id: string;
    image_url?: string;
    label?: string;
    order_index?: number;
    is_active?: boolean;
}
