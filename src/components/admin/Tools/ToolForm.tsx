import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/FileUpload';
import { Tool, ToolFormData } from '@/lib/types/tools.types';

interface ToolFormProps {
  tool?: Tool;
  onSubmit: (data: ToolFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const initialFormData: ToolFormData = {
  name: '',
  icon_url: '',
  category: 'tools',
  description: '',
  is_active: true,
};

export function ToolForm({ tool, onSubmit, onCancel, isLoading = false }: ToolFormProps) {
  const [formData, setFormData] = useState<ToolFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<ToolFormData>>({});

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        icon_url: tool.icon_url,
        category: tool.category,
        description: tool.description || '',
        is_active: tool.is_active,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [tool]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ToolFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.icon_url.trim()) {
      newErrors.icon_url = 'Icon URL is required';
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

  const handleInputChange = (field: keyof ToolFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value } as ToolFormData));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (url: string) => {
    handleInputChange('icon_url', url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {/* Basic Information */}
      {/* Form Fields Stack */}
      <div className="flex flex-col gap-5">

        {/* Name Input */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-gray-200">Tool Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g. Visual Studio Code"
            className={`bg-navy-900/50 border-navy-600 text-white placeholder:text-gray-500 focus:border-cyan-500/50 transition-colors ${errors.name ? 'border-red-500/50' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-400 font-medium">{errors.name}</p>}
        </div>

        {/* Description Input */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium text-gray-200">Description <span className="text-gray-500 font-normal ml-1">(Optional)</span></Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Briefly describe this tool..."
            rows={3}
            className="bg-navy-900/50 border-navy-600 text-white placeholder:text-gray-500 focus:border-cyan-500/50 transition-colors resize-none"
          />
        </div>

        {/* Category Input */}
        <div className="space-y-1.5">
          <Label htmlFor="category" className="text-sm font-medium text-gray-200">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger className="bg-navy-900/50 border-navy-600 text-white focus:border-cyan-500/50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-navy-900 border-navy-600">
              <SelectItem value="languages">Languages</SelectItem>
              <SelectItem value="frameworks">Frameworks</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="databases">Databases</SelectItem>
              <SelectItem value="cloud">Cloud</SelectItem>
              <SelectItem value="ai">AI</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Icon Upload */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-gray-200">Icon</Label>
          <FileUpload
            onUpload={handleImageUpload}
            folder="tools"
            currentImage={formData.icon_url}
            className={`bg-navy-900/50 border border-dashed border-navy-600 rounded-lg p-4 hover:bg-navy-900/80 transition-colors ${errors.icon_url ? 'border-red-500/50' : ''}`}
          />
          {errors.icon_url && <p className="text-xs text-red-400 font-medium mt-1">{errors.icon_url}</p>}
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
          {isLoading ? 'Saving...' : tool ? 'Update Tool' : 'Create Tool'}
        </Button>
      </div>
    </form>
  );
}