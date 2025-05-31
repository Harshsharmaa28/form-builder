import React, { useState, useEffect } from 'react';
import { FormResponse, getResponsesByFormId, deleteResponse } from '~/utils/responseStorage';
import { getFormById, getForms } from '~/utils/formStorage';

import { FormSchema } from '~/types/form';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Trash2, Eye, Download, FileText, Plus } from 'lucide-react';
import { toast } from '~/hooks/use-toast';
import { Link, useNavigate } from '@remix-run/react';

interface ResponseViewerProps {
  formId?: string; // made optional
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ formId }) => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [form, setForm] = useState<FormSchema | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [forms, setForms] = useState<FormSchema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (formId) {
      const formData = getFormById(formId);
      const responseData = getResponsesByFormId(formId);
      setForm(formData);
      setResponses(responseData);
    } else {
      const allForms = getForms();
      setForms(allForms);
    }
  }, [formId]);

  const handleDeleteResponse = (responseId: string) => {
    deleteResponse(responseId);
    setResponses(prev => prev.filter(r => r.id !== responseId));
    toast({
      title: "Response deleted",
      description: "The response has been deleted successfully."
    });
  };

  const exportResponses = () => {
    const csvData = responses.map(response => {
      const row: Record<string, any> = {
        'Submitted At': response.submittedAt.toLocaleString(),
        'Response ID': response.id
      };

      if (form) {
        form.fields.forEach(field => {
          row[field.label] = response.responses[field.id] || '';
        });
      }

      return row;
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form?.title || 'form'}_responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ----------------------------
  // If no formId, show all forms
  // ----------------------------
  if (!formId) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Select a Form to View Responses</h2>
        {forms.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first form to get started with our powerful form builder.
                </p>
                <Link to="/builder">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Form
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="truncate">{form.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {form.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{form.fields.length} fields</span>
                      <span>{form.isMultiStep ? `${form.steps.length} steps` : 'Single step'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(form.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/responses/${form.id}`)}>
                        <Eye className="w-3 h-3 mr-1" />
                        View Responses
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------
  // If formId exists, show responses
  // ----------------------------

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{form.title} - Responses</h2>
          <p className="text-muted-foreground">
            {responses.length} response{responses.length !== 1 ? 's' : ''} received
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportResponses} variant="outline" disabled={responses.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No responses yet</h3>
            <p className="text-muted-foreground mb-6">
              Share your form to start collecting responses from users.
            </p>
            <Link to={`/form/${form.id}`}>
              <Button size="lg">
                <Eye className="w-5 h-5 mr-2" />
                View Form
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Response ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell>{response.submittedAt.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-sm">{response.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Completed</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedResponse(response)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Response Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {form.fields.map((field) => (
                                <div key={field.id}>
                                  <label className="font-medium">{field.label}</label>
                                  <div className="mt-1 p-2 bg-muted rounded">
                                    {response.responses[field.id] || 'No response'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteResponse(response.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponseViewer;
