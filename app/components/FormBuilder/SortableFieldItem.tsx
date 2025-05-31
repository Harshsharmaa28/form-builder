
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '~/types/form';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { CalendarIcon, X, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '~/lib/utils';

interface SortableFieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableFieldItem: React.FC<SortableFieldItemProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const renderFieldPreview = () => {
    const baseProps = {
      placeholder: field.placeholder,
      disabled: true,
      className: "pointer-events-none"
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return <Input {...baseProps} type={field.type} />;
      
      case 'textarea':
        return <Textarea {...baseProps} />;
      
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
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
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <label className="text-sm">{field.label}</label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" disabled className="pointer-events-none" />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal pointer-events-none",
                  "text-muted-foreground"
                )}
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.placeholder || "Pick a date"}
              </Button>
            </PopoverTrigger>
          </Popover>
        );
      
      default:
        return <Input {...baseProps} />;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 cursor-pointer transition-all",
        isSelected && "ring-2 ring-primary",
        isDragging && "shadow-lg"
      )}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div {...attributes} {...listeners} className="flex items-center gap-2 cursor-grab">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            </div>
            <div>
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              {field.helpText && (
                <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="pointer-events-none">
          {field.type !== 'checkbox' && renderFieldPreview()}
          {field.type === 'checkbox' && renderFieldPreview()}
        </div>
      </div>
    </Card>
  );
};

export default SortableFieldItem;
