export interface Tool {
  id: string;
  name: string;
  icon_url: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ToolFormData {
  name: string;
  icon_url: string;
  category: string;
  description: string;
  is_active: boolean;
}

export interface CreateToolInput extends Omit<Tool, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateToolInput extends Partial<CreateToolInput> {
  id: string;
}