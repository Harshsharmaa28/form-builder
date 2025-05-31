
import React from 'react';
import { FormField } from '~/types/form';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Plus, X } from 'lucide-react';

interface FieldEditorProps {
  field: FormField | null;
  onFieldUpdate: (field: FormField) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onFieldUpdate }) => {
  if (!field) {
    return (
      <div className="w-80 bg-background border-l p-4">
        <div className="text-center text-muted-foreground mt-8">
          <p>Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate({ ...field, ...updates });
  };

  const updateValidation = (validation: Partial<FormField['validation']>) => {
    updateField({
      validation: { ...field.validation, ...validation }
    });
  };

  const addOption = () => {
    const options = field.options || [];
    updateField({ options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(field.options || [])];
    options[index] = value;
    updateField({ options });
  };

  const removeOption = (index: number) => {
    const options = [...(field.options || [])];
    options.splice(index, 1);
    updateField({ options });
  };

  const needsOptions = ['select', 'radio'].includes(field.type);

  return (
    <div className="w-80 bg-background border-l p-4 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={field.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={field.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>

          <div>
            <Label htmlFor="helpText">Help Text</Label>
            <Textarea
              id="helpText"
              value={field.helpText || ''}
              onChange={(e) => updateField({ helpText: e.target.value })}
              placeholder="Additional help text"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Field</Label>
            <Switch
              id="required"
              checked={field.required}
              onCheckedChange={(required) => updateField({ required })}
            />
          </div>

          {needsOptions && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2 mt-2">
                {(field.options || []).map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeOption(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addOption}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Validation</Label>
            
            {['text', 'textarea'].includes(field.type) && (
              <>
                <div>
                  <Label htmlFor="minLength">Min Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => updateValidation({ 
                      minLength: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Minimum length"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLength">Max Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => updateValidation({ 
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Maximum length"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="pattern">Pattern (Regex)</Label>
              <Input
                id="pattern"
                value={field.validation?.pattern || ''}
                onChange={(e) => updateValidation({ pattern: e.target.value })}
                placeholder="^[A-Za-z]+$"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldEditor;
