import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HeroSetting, HeroBadgeFormData } from '@/lib/types/hero.types';

interface HeroBadgeFormProps {
    badge?: HeroSetting;
    onSubmit: (data: HeroBadgeFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    nextOrderIndex?: number;
}

const getInitialFormData = (nextOrderIndex: number): HeroBadgeFormData => ({
    value: '',
    order_index: nextOrderIndex,
    is_active: true,
});

export function HeroBadgeForm({ badge, onSubmit, onCancel, isLoading = false, nextOrderIndex = 0 }: HeroBadgeFormProps) {
    const [formData, setFormData] = useState<HeroBadgeFormData>(getInitialFormData(nextOrderIndex));
    const [errors, setErrors] = useState<Partial<Record<keyof HeroBadgeFormData, string>>>({});

    useEffect(() => {
        if (badge) {
            setFormData({
                value: badge.value,
                order_index: badge.order_index,
                is_active: badge.is_active,
            });
        } else {
            setFormData(getInitialFormData(nextOrderIndex));
        }
    }, [badge, nextOrderIndex]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof HeroBadgeFormData, string>> = {};

        if (!formData.value.trim()) {
            newErrors.value = 'Badge text is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleInputChange = (field: keyof HeroBadgeFormData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="flex flex-col gap-5">
                {/* Badge Text Input */}
                <div className="space-y-1.5">
                    <Label htmlFor="value" className="text-sm font-medium text-gray-200">Badge Text</Label>
                    <Input
                        id="value"
                        value={formData.value}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        placeholder="e.g. BSIT Student, Full Stack Developer"
                        className={`bg-navy-900/50 border-navy-600 text-white placeholder:text-gray-500 focus:border-cyan-500/50 transition-colors ${errors.value ? 'border-red-500/50' : ''}`}
                    />
                    {errors.value && <p className="text-xs text-red-400 font-medium">{errors.value}</p>}
                </div>

                {/* Order Index Input */}
                <div className="space-y-1.5">
                    <Label htmlFor="order_index" className="text-sm font-medium text-gray-200">Display Order</Label>
                    <Input
                        id="order_index"
                        type="number"
                        min={0}
                        value={formData.order_index}
                        onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                        className="bg-navy-900/50 border-navy-600 text-white placeholder:text-gray-500 focus:border-cyan-500/50 transition-colors"
                    />
                    <p className="text-xs text-gray-500">Lower numbers appear first</p>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between bg-navy-900/30 p-3 rounded-lg border border-navy-700/50">
                    <Label htmlFor="is_active" className="text-sm font-medium text-gray-200 cursor-pointer">Active Status</Label>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${formData.is_active ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {formData.is_active ? 'Visible' : 'Hidden'}
                        </span>
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                            className="data-[state=checked]:bg-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-navy-700">
                <Button type="button" variant="outline" onClick={onCancel} className="bg-transparent border-navy-600 text-white hover:bg-navy-700">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : badge ? 'Update Badge' : 'Add Badge'}
                </Button>
            </div>
        </form>
    );
}
