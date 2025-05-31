
import React from 'react';
import { FormTemplate } from '~/types/form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { predefinedTemplates } from '~/utils/formTemplates';
import { getTemplates } from '~/utils/formStorage';

interface TemplateSelectorProps {
  onSelectTemplate: (template: FormTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const userTemplates = getTemplates();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Load Template</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Predefined Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {template.schema.fields.length} fields
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {template.schema.isMultiStep ? `${template.schema.steps.length} steps` : 'Single step'}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => onSelectTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {userTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">My Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-accent transition-colors">
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {template.schema.fields.length} fields
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {template.schema.isMultiStep ? `${template.schema.steps.length} steps` : 'Single step'}
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => onSelectTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
