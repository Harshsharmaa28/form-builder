
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card } from '~/components/ui/card';
import { Type, FileText, ChevronDown, Square, Calendar, Mail, Phone, Hash } from 'lucide-react';

interface FieldType {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const fieldTypes: FieldType[] = [
  { type: 'text', label: 'Text Input', icon: <Type className="w-4 h-4" /> },
  { type: 'textarea', label: 'Textarea', icon: <FileText className="w-4 h-4" /> },
  { type: 'select', label: 'Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <Square className="w-4 h-4" /> },
  { type: 'radio', label: 'Radio Button', icon: <Square className="w-4 h-4" /> },
  { type: 'date', label: 'Date Picker', icon: <Calendar className="w-4 h-4" /> },
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { type: 'number', label: 'Number', icon: <Hash className="w-4 h-4" /> }
];

interface DraggableFieldProps {
  fieldType: FieldType;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ fieldType }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${fieldType.type}`,
    data: { type: fieldType.type }
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-2">
        {fieldType.icon}
        <span className="text-sm font-medium">{fieldType.label}</span>
      </div>
    </Card>
  );
};

const FieldPalette: React.FC = () => {
  return (
    <div className="w-64 bg-background border-r p-4">
      <h3 className="font-semibold mb-4">Form Fields</h3>
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <DraggableField key={fieldType.type} fieldType={fieldType} />
        ))}
      </div>
    </div>
  );
};

export default FieldPalette;
