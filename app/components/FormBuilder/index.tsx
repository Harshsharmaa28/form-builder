import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FormField, FormSchema, FormStep, FormTemplate } from '~/types/form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/hooks/use-toast';
import { saveForm, getForms } from '~/utils/formStorage';
import { getResponsesByFormId } from '~/utils/responseStorage';
import { useUndoRedo } from '~/hooks/useUndoRedo';
import { useTheme } from '~/contexts/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import FieldPalette from './FieldPalette';
import FormCanvas from './FormCanvas';
import FieldEditor from './FieldEditor';
import FormPreview from './FormPreview';
import StepManager from './StepManager';
import TemplateSelector from './TemplateSelector';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Share2, Save, Eye, FileText, Undo, Redo, Sun, Moon, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const initialForm: FormSchema = {
    id: uuidv4(),
    title: 'New Form',
    description: '',
    fields: [],
    steps: [{ id: uuidv4(), title: 'Step 1', fields: [] }],
    isMultiStep: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const { state: form, set: setForm, undo, redo, canUndo, canRedo, reset } = useUndoRedo(initialForm);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responseCount, setResponseCount] = useState(0);

  // Auto-save functionality - enhanced to save to localStorage every change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (form.fields.length > 0 || form.title !== 'New Form') {
        saveForm(form);
        console.log('Form auto-saved to localStorage');
      }
    }, 1000); // Auto-save 1 second after last change

    return () => clearTimeout(timeoutId);
  }, [form]);

  // Load response count
  useEffect(() => {
    const responses = getResponsesByFormId(form.id);
    setResponseCount(responses.length);
  }, [form.id]);

  // Keyboard shortcuts for undo/redo

    useEffect(() => {
      if (typeof window === 'undefined') return; // ✅ ensure this only runs in the browser

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [undo, redo]);


  const updateForm = (updates: Partial<FormSchema>) => {
    setForm({ ...form, ...updates, updatedAt: new Date() });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle reordering existing fields
    if (over.id === 'form-canvas' || active.data.current?.sortable) {
      const oldIndex = form.fields.findIndex(f => f.id === active.id);
      const newIndex = form.fields.findIndex(f => f.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(form.fields, oldIndex, newIndex);
        updateForm({ fields: newFields });
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || over.id !== 'form-canvas') return;

    // Handle adding new field from palette
    if (active.id.toString().startsWith('palette-')) {
      const fieldType = active.data.current?.type;
      if (fieldType) {
        const newField: FormField = {
          id: uuidv4(),
          type: fieldType,
          label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          placeholder: `Enter ${fieldType}`,
          required: false,
          step: currentStep,
          options: ['select', 'radio'].includes(fieldType) ? ['Option 1', 'Option 2'] : undefined
        };

        updateForm({ fields: [...form.fields, newField] });
        setSelectedField(newField);
      }
    }
  };

  const handleFieldUpdate = (updatedField: FormField) => {
    updateForm({
      fields: form.fields.map(f => f.id === updatedField.id ? updatedField : f)
    });
    setSelectedField(updatedField);
  };

  const handleFieldDelete = (fieldId: string) => {
    updateForm({
      fields: form.fields.filter(f => f.id !== fieldId)
    });
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setSelectedField(null);
  };

  const handleToggleMultiStep = (enabled: boolean) => {
    updateForm({ isMultiStep: enabled });
    
    if (enabled && form.steps.length === 1) {
      // Add a second step when enabling multi-step
      updateForm({
        steps: [
          ...form.steps,
          { id: uuidv4(), title: 'Step 2', fields: [] }
        ]
      });
    } else if (!enabled) {
      // Move all fields to step 0 when disabling multi-step
      updateForm({
        fields: form.fields.map(field => ({ ...field, step: 0 })),
        steps: [form.steps[0]]
      });
    }
  };

  const handleAddStep = () => {
    const newStep: FormStep = {
      id: uuidv4(),
      title: `Step ${form.steps.length + 1}`,
      fields: []
    };
    
    updateForm({ steps: [...form.steps, newStep] });
  };

  const handleRemoveStep = (stepIndex: number) => {
    if (form.steps.length <= 1) return;
    
    // Move fields from deleted step to previous step
    const fieldsToMove = form.fields.filter(f => f.step === stepIndex);
    const targetStep = stepIndex > 0 ? stepIndex - 1 : 0;
    
    updateForm({
      steps: form.steps.filter((_, index) => index !== stepIndex),
      fields: form.fields.map(field => 
        field.step === stepIndex 
          ? { ...field, step: targetStep }
          : field.step > stepIndex 
            ? { ...field, step: field.step - 1 }
            : field
      )
    });
    
    if (currentStep >= stepIndex) {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  const handleUpdateStep = (stepIndex: number, updates: Partial<FormStep>) => {
    updateForm({
      steps: form.steps.map((step, index) => 
        index === stepIndex ? { ...step, ...updates } : step
      )
    });
  };

  const handleSelectTemplate = (template: FormTemplate) => {
    const newForm: FormSchema = {
      ...template.schema,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    reset(newForm);
    setSelectedField(null);
    setCurrentStep(0);
    
    toast({
      title: "Template loaded",
      description: `${template.name} template has been loaded successfully.`
    });
  };

  const handleSaveForm = () => {
    saveForm(form);
    toast({
      title: "Form saved",
      description: "Your form has been saved successfully."
    });
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/form/${form.id}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Shareable form link has been copied to clipboard."
      });
    });
  };

  const exportForm = () => {
    const dataStr = JSON.stringify(form, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const viewResponses = () => {
    navigate(`/responses/${form.id}`);
  };

  return (
    <div className="h-screen flex bg-background">
      <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        {/* Left Sidebar - Field Palette */}
        <FieldPalette />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md space-y-2">
                <Input
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="text-lg font-semibold"
                  placeholder="Form title"
                />
                <Textarea
                  value={form.description || ''}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Form description (optional)"
                  rows={1}
                  className="resize-none"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={undo} 
                  variant="outline" 
                  size="sm"
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={redo} 
                  variant="outline" 
                  size="sm"
                  disabled={!canRedo}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={toggleTheme} 
                  variant="outline" 
                  size="sm"
                  title="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                <TemplateSelector onSelectTemplate={handleSelectTemplate} />
                <Button onClick={handleSaveForm} variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={generateShareableLink} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={viewResponses} variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Responses ({responseCount})
                </Button>
                <Button onClick={exportForm} variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Form Canvas */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <StepManager
                  steps={form.steps}
                  currentStep={currentStep}
                  isMultiStep={form.isMultiStep}
                  onStepChange={setCurrentStep}
                  onToggleMultiStep={(enabled) => updateForm({ isMultiStep: enabled })}
                  onAddStep={() => {
                    const newStep: FormStep = {
                      id: uuidv4(),
                      title: `Step ${form.steps.length + 1}`,
                      fields: []
                    };
                    updateForm({ steps: [...form.steps, newStep] });
                  }}
                  onRemoveStep={(stepIndex) => {
                    if (form.steps.length <= 1) return;
                    
                    const fieldsToMove = form.fields.filter(f => f.step === stepIndex);
                    const targetStep = stepIndex > 0 ? stepIndex - 1 : 0;
                    
                    updateForm({
                      steps: form.steps.filter((_, index) => index !== stepIndex),
                      fields: form.fields.map(field => 
                        field.step === stepIndex 
                          ? { ...field, step: targetStep }
                          : field.step > stepIndex 
                            ? { ...field, step: field.step - 1 }
                            : field
                      )
                    });
                    
                    if (currentStep >= stepIndex) {
                      setCurrentStep(Math.max(0, currentStep - 1));
                    }
                  }}
                  onUpdateStep={(stepIndex, updates) => {
                    updateForm({
                      steps: form.steps.map((step, index) => 
                        index === stepIndex ? { ...step, ...updates } : step
                      )
                    });
                  }}
                />
              </div>
              
              <FormCanvas
                fields={form.fields}
                currentStep={currentStep}
                onFieldSelect={setSelectedField}
                onFieldDelete={handleFieldDelete}
                selectedFieldId={selectedField?.id}
              />
            </div>

            {/* Right Sidebar - Field Editor */}
            <FieldEditor
              field={selectedField}
              onFieldUpdate={handleFieldUpdate}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <FormPreview
          fields={form.fields}
          currentStep={currentStep}
          title={form.title}
          description={form.description}
        />
      </DndContext>
    </div>
  );
};

export default FormBuilder;
