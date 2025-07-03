import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PipelineViewer({ runs }: { runs: any[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failure':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {runs.map((run) => (
        <Card key={run.id}>
          <CardHeader>
            <CardTitle>Run {run.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {run.steps.map((step: any) => (
                <AccordionItem value={step.name} key={step.name}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-4">
                      <span>{step.name}</span>
                      <Badge variant={getStatusVariant(step.status)}>{step.status}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {step.error && <p className="text-red-500">{step.error}</p>}
                    <pre className="text-sm bg-gray-100 p-2 rounded-md">
                      {JSON.stringify(step, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}