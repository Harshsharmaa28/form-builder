
import React from 'react';
import { FormStep } from '~/types/form';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Progress } from '~/components/ui/progress';

interface StepManagerProps {
  steps: FormStep[];
  currentStep: number;
  isMultiStep: boolean;
  onStepChange: (stepIndex: number) => void;
  onToggleMultiStep: (enabled: boolean) => void;
  onAddStep: () => void;
  onRemoveStep: (stepIndex: number) => void;
  onUpdateStep: (stepIndex: number, updates: Partial<FormStep>) => void;
}

const StepManager: React.FC<StepManagerProps> = ({
  steps,
  currentStep,
  isMultiStep,
  onStepChange,
  onToggleMultiStep,
  onAddStep,
  onRemoveStep,
  onUpdateStep
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Form Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="multiStep">Multi-step Form</Label>
          <Switch
            id="multiStep"
            checked={isMultiStep}
            onCheckedChange={onToggleMultiStep}
          />
        </div>

        {isMultiStep && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{currentStep + 1} of {steps.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    index === currentStep ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => onStepChange(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Input
                        value={step.title}
                        onChange={(e) => onUpdateStep(index, { title: e.target.value })}
                        className="font-medium bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                        placeholder="Step title"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                      {steps.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveStep(index);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={onAddStep} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => onStepChange(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StepManager;
