
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormField } from '~/types/form';
import SortableFieldItem from './SortableFieldItem';

interface FormCanvasProps {
  fields: FormField[];
  currentStep: number;
  onFieldSelect: (field: FormField) => void;
  onFieldDelete: (fieldId: string) => void;
  selectedFieldId?: string;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  currentStep,
  onFieldSelect,
  onFieldDelete,
  selectedFieldId
}) => {
  const { setNodeRef } = useDroppable({
    id: 'form-canvas'
  });

  const stepFields = fields.filter(field => field.step === currentStep);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Form Builder</h2>
          <p className="text-muted-foreground">
            Drag fields from the left panel to build your form
          </p>
        </div>
        
        <div
          ref={setNodeRef}
          className="min-h-[400px] border-2 border-dashed border-border rounded-lg p-6 bg-background"
        >
          {stepFields.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">Drop fields here to start building</p>
                <p className="text-sm">Drag any field from the left panel</p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={stepFields.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {stepFields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    isSelected={selectedFieldId === field.id}
                    onSelect={() => onFieldSelect(field)}
                    onDelete={() => onFieldDelete(field.id)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;
