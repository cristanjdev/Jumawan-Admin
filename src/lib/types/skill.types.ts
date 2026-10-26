export interface SkillCategory {
    id: string;
    title: string;
    icon_slug: string;
    color_slug: string;
    skills: string[];
    /** A plain-language line shown under the title */
    description?: string;
    /** Titles of projects that show this skill; each opens that project on the portfolio */
    examples?: string[];
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateSkillCategoryInput {
    title: string;
    icon_slug: string;
    color_slug: string;
    skills: string[];
    description?: string;
    examples?: string[];
    order_index?: number;
    is_active?: boolean;
}

export interface UpdateSkillCategoryInput {
    id: string;
    title?: string;
    icon_slug?: string;
    color_slug?: string;
    skills?: string[];
    description?: string;
    examples?: string[];
    order_index?: number;
    is_active?: boolean;
}

export const SKILL_ICON_OPTIONS = [
    { value: 'code', label: 'Code' },
    { value: 'server', label: 'Server' },
    { value: 'database', label: 'Database' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'testtube', label: 'Test Tube' },
    { value: 'gitbranch', label: 'Git Branch' },
    { value: 'layers', label: 'Layers' },
    { value: 'cpu', label: 'CPU' },
    { value: 'globe', label: 'Globe (web)' },
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'shield', label: 'Shield (security)' },
    { value: 'radio', label: 'Radio (connected)' },
    { value: 'sparkles', label: 'Sparkles' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'appwindow', label: 'App window (web)' },
    { value: 'monitorsmartphone', label: 'Monitor and phone' },
    { value: 'fingerprint', label: 'Fingerprint' },
    { value: 'circuitboard', label: 'Circuit board' },
    { value: 'wand', label: 'Magic wand' },
] as const;

export const SKILL_COLOR_OPTIONS = [
    { value: 'cyan', label: 'Cyan' },
    { value: 'sky-blue', label: 'Sky Blue' },
    { value: 'blue-primary', label: 'Blue / Primary' },
    { value: 'primary-accent', label: 'Primary / Accent' },
    { value: 'accent-sky', label: 'Accent / Sky' },
    { value: 'sky', label: 'Sky' },
    { value: 'navy', label: 'Navy' },
] as const;
