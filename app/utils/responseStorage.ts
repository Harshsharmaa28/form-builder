export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: Date;
  submitterInfo?: {
    userAgent: string;
    ip?: string;
  };
}

const RESPONSES_KEY = 'form_builder_responses';

export const getResponses = (): FormResponse[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(RESPONSES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored).map((response: any) => ({
      ...response,
      submittedAt: new Date(response.submittedAt),
    }));
  } catch {
    return [];
  }
};

export const saveResponse = (response: FormResponse): void => {
  if (typeof window === "undefined") return;

  const responses = getResponses();
  responses.push(response);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
};

export const getResponsesByFormId = (formId: string): FormResponse[] => {
  if (typeof window === "undefined") return [];
  return getResponses().filter(response => response.formId === formId);
};

export const deleteResponse = (responseId: string): void => {
  if (typeof window === "undefined") return;

  const responses = getResponses().filter(r => r.id !== responseId);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
};
