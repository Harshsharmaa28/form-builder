
export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  step?: number;
}

export interface FormStep {
  id: string;
  title: string;
  fields: string[];
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  steps: FormStep[];
  isMultiStep: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  schema: Omit<FormSchema, 'id' | 'createdAt' | 'updatedAt'>;
}

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';
