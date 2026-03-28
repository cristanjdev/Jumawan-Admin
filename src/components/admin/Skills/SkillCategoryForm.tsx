import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SkillCategory, SKILL_ICON_OPTIONS, SKILL_COLOR_OPTIONS } from '@/lib/types/skill.types';
import { X } from 'lucide-react';

interface SkillCategoryFormProps {
    readonly category?: SkillCategory | null;
    readonly onSubmit: (data: { title: string; icon_slug: string; color_slug: string; skills: string[] }) => Promise<void>;
    readonly onCancel: () => void;
    readonly isLoading: boolean;
    readonly nextOrderIndex: number;
}

export function SkillCategoryForm({
    category,
    onSubmit,
    onCancel,
    isLoading,
    nextOrderIndex,
}: SkillCategoryFormProps) {
    const [title, setTitle] = useState(category?.title ?? '');
    const [iconSlug, setIconSlug] = useState(category?.icon_slug ?? 'code');
    const [colorSlug, setColorSlug] = useState(category?.color_slug ?? 'cyan');
    const [skills, setSkills] = useState<string[]>(category?.skills ?? []);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (category) {
            setTitle(category.title);
            setIconSlug(category.icon_slug);
            setColorSlug(category.color_slug);
            setSkills(category.skills ?? []);
        } else {
            setTitle('');
            setIconSlug('code');
            setColorSlug('cyan');
            setSkills([]);
        }
    }, [category]);

    const addSkill = () => {
        const t = newSkill.trim();
        if (t && !skills.includes(t)) {
            setSkills([...skills, t]);
            setNewSkill('');
        }
    };

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        await onSubmit({
            title: title.trim(),
            icon_slug: iconSlug,
            color_slug: colorSlug,
            skills,
        });
    };

    let submitLabel = 'Add';
    if (isLoading) submitLabel = 'Saving...';
    else if (category) submitLabel = 'Update';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="skill-title" className="text-gray-300">Category title</Label>
                <Input
                    id="skill-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Languages, Frameworks"
                    className="bg-navy-900/50 border-navy-600 text-white mt-2"
                />
            </div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-gray-300">Icon</Label>
                    <Select value={iconSlug} onValueChange={setIconSlug}>
                        <SelectTrigger className="mt-2 bg-navy-900/50 border-navy-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SKILL_ICON_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-white">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-gray-300">Color</Label>
                    <Select value={colorSlug} onValueChange={setColorSlug}>
                        <SelectTrigger className="mt-2 bg-navy-900/50 border-navy-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SKILL_COLOR_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-white">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label className="text-gray-300">Skills (add one per line or use the input)</Label>
                <div className="flex gap-2 mt-2">
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill();
                            }
                        }}
                        placeholder="e.g. React"
                        className="bg-navy-900/50 border-navy-600 text-white flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addSkill} className="border-navy-600 text-gray-300">
                        Add
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((s, i) => (
                        <span
                            key={`${s}-${i}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-navy-700 text-sm text-gray-200"
                        >
                            {s}
                            <button
                                type="button"
                                onClick={() => removeSkill(i)}
                                className="hover:text-red-400"
                                aria-label={`Remove ${s}`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="border-navy-600 text-gray-300">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !title.trim()}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
