import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormSchema, FormField } from '~/types/form';
import { getFormById } from '~/utils/formStorage';
import { saveResponse, FormResponse } from '~/utils/responseStorage';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Checkbox } from '~/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { toast } from '~/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  [key: string]: any;
}

const FormFiller: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!formId) return;

    const loadForm = async () => {
      const loadedForm = getFormById(formId);
      if (loadedForm) {
        setForm(loadedForm);
      } else {
        toast({
          title: "Error",
          description: "Form not found.",
          variant: "destructive"
        });
      }
    };

    loadForm();
  }, [formId]);

  if (!form) {
    return <div>Loading form...</div>;
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setFieldErrors(prev => {
      const { [fieldId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const currentFields = form.isMultiStep ? form.steps[currentStep].fields : form.fields.map(f => f.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate required fields
    const errors: Record<string, string> = {};
    form.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        errors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Save response
    const response: FormResponse = {
      id: uuidv4(),
      formId: form.id,
      responses: formData,
      submittedAt: new Date(),
      submitterInfo: {
        userAgent: navigator.userAgent
      }
    };

    saveResponse(response);

    toast({
      title: "Form submitted successfully!",
      description: "Thank you for your submission."
    });

    // Reset form
    setFormData({});
    setFieldErrors({});
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < form.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = form.isMultiStep ? ((currentStep + 1) / form.steps.length) * 100 : 100;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {form.isMultiStep && (
            <div className="mb-4">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep + 1} of {form.steps.length}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {form.fields.filter(field => currentFields.includes(field.id)).map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}{field.required && ' *'}</Label>
                {field.type === 'text' && (
                  <Input
                    type="text"
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    aria-invalid={!!fieldErrors[field.id]}
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    aria-invalid={!!fieldErrors[field.id]}
                  />
                )}
                {field.type === 'select' && field.options && (
                  <Select onValueChange={(value) => handleInputChange(field.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option, index) => (
                        <SelectItem key={index} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={formData[field.id] || false}
                      onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                    />
                  </div>
                )}
                {field.type === 'radio' && field.options && (
                  <RadioGroup onValueChange={(value) => handleInputChange(field.id, value)}>
                    {field.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                        <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                 {field.type === 'date' && (
                  <Input
                    type="date"
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    aria-invalid={!!fieldErrors[field.id]}
                  />
                )}
                {field.type === 'email' && (
                  <Input
                    type="email"
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    aria-invalid={!!fieldErrors[field.id]}
                  />
                )}
                {field.type === 'phone' && (
                  <Input
                    type="tel"
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    aria-invalid={!!fieldErrors[field.id]}
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    aria-invalid={!!fieldErrors[field.id]}
                    step={field.step}
                  />
                )}
                {fieldErrors[field.id] && (
                  <p className="text-sm text-red-500">{fieldErrors[field.id]}</p>
                )}
              </div>
            ))}
            {form.isMultiStep && (
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === form.steps.length - 1}
                  variant="outline"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormFiller;
