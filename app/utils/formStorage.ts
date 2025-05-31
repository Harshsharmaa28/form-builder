import { FormSchema, FormTemplate } from '~/types/form';

const FORMS_KEY = 'form_builder_forms';
const TEMPLATES_KEY = 'form_builder_templates';

export const getForms = (): FormSchema[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(FORMS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored).map((form: any) => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt),
    }));
  } catch {
    return [];
  }
};

// Save or update a form
export const saveForm = (form: FormSchema): void => {
  if (typeof window === "undefined") return;

  const forms = getForms();
  const existingIndex = forms.findIndex(f => f.id === form.id);

  const updatedForm = { ...form, updatedAt: new Date() };

  if (existingIndex >= 0) {
    forms[existingIndex] = updatedForm;
  } else {
    forms.push(updatedForm);
  }

  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
};

// Get a specific form by ID
export const getFormById = (id: string): FormSchema | null => {
  if (typeof window === "undefined") return null;

  const forms = getForms();
  return forms.find(f => f.id === id) || null;
};

// Delete a form by ID
export const deleteForm = (id: string): void => {
  if (typeof window === "undefined") return;

  const forms = getForms().filter(f => f.id !== id);
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
};

// Safely get templates from localStorage
export const getTemplates = (): FormTemplate[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(TEMPLATES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// Save or update a template
export const saveTemplate = (template: FormTemplate): void => {
  if (typeof window === "undefined") return;

  const templates = getTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};
