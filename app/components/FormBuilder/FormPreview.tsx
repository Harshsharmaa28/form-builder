
import React, { useState } from 'react';
import { FormField, PreviewMode } from '~/types/form';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { CalendarIcon, Monitor, Tablet, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '~/lib/utils';

interface FormPreviewProps {
  fields: FormField[];
  currentStep: number;
  title: string;
  description?: string;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  fields,
  currentStep,
  title,
  description
}) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stepFields = fields.filter(field => field.step === currentStep);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const validation = field.validation;
      const stringValue = value?.toString() || '';

      if (validation.minLength && stringValue.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }

      if (validation.maxLength && stringValue.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`;
      }

      if (validation.pattern && !new RegExp(validation.pattern).test(stringValue)) {
        return `${field.label} format is invalid`;
      }
    }

    // Built-in validation for email and phone
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value };
    setFormData(newFormData);

    const field = stepFields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      const newErrors = { ...errors };
      if (error) {
        newErrors[fieldId] = error;
      } else {
        delete newErrors[fieldId];
      }
      setErrors(newErrors);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];
    const fieldId = `preview-${field.id}`;

    const commonProps = {
      id: fieldId,
      className: cn(error && "border-destructive")
    };

    let fieldElement;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        fieldElement = (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
        break;

      case 'textarea':
        fieldElement = (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rows={3}
          />
        );
        break;

      case 'select':
        fieldElement = (
          <Select
            value={value || ''}
            onValueChange={(selectedValue) => handleFieldChange(field.id, selectedValue)}
          >
            <SelectTrigger className={cn(error && "border-destructive")}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      case 'checkbox':
        fieldElement = (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <label htmlFor={fieldId} className="text-sm">
              {field.label}
            </label>
          </div>
        );
        break;

      case 'radio':
        fieldElement = (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${fieldId}-${index}`}
                  name={fieldId}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
                <label htmlFor={`${fieldId}-${index}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
        break;

      case 'date':
        fieldElement = (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : field.placeholder || "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleFieldChange(field.id, date?.toISOString())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );
        break;

      default:
        fieldElement = (
          <Input
            {...commonProps}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
    }

    return (
      <div key={field.id} className="space-y-2">
        {field.type !== 'checkbox' && (
          <label htmlFor={fieldId} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {fieldElement}
        {field.helpText && (
          <p className="text-xs text-muted-foreground">{field.helpText}</p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-md';
      default: return 'max-w-2xl';
    }
  };

  return (
    <div className="w-full md:w-[400px] xl:w-[500px] 2xl:w-[600px] bg-background border-l p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Preview Mode Toggle */}
        <div>
          <h3 className="font-semibold mb-2">Preview Mode</h3>
          <div className="flex gap-1 p-1 bg-muted rounded justify-center sm:justify-start">
            <Button
              size="sm"
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Preview Form Card */}
        <div
          className={cn(
            "mx-auto transition-all duration-300",
            previewMode === 'mobile' && "max-w-xs",
            previewMode === 'tablet' && "max-w-sm",
            previewMode === 'desktop' && "max-w-2xl"
          )}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {stepFields.map(renderField)}
                <Button type="button" className="w-full mt-6">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
