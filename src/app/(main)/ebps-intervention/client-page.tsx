'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type EBPSData = {
  [key: string]: {
    description: string;
    howShouldWeDo: string;
    diet: Record<string, string>;
    recommendations: Record<string, string | string[]>;
  };
};

type EBPSInterventionClientPageProps = {
  data: EBPSData;
};

export function EBPSInterventionClientPage({ data }: EBPSInterventionClientPageProps) {
  const dataKeys = Object.keys(data);
  const [selectedKey, setSelectedKey] = useState(dataKeys[0] || '');

  const selectedData = data[selectedKey];

  if (!selectedData) {
     return (
        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold">No data available</h2>
          <p>Please select an item or add data in the admin panel.</p>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 items-start gap-x-6 p-4 bg-[#fefdf9] border border-gray-200 rounded-md">
        <div className="col-span-3 flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Click -&gt;</span>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-full bg-black text-white border-black">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {dataKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-9 flex items-start gap-4">
           <h3 className="font-semibold text-foreground whitespace-nowrap pt-2">Description</h3>
           <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedData.description}</p>
        </div>
      </div>
      
      <Tabs defaultValue="biomarkers" className="w-full">
        <div className="grid grid-cols-2 gap-x-6">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 border-2 border-[#f0c242] rounded-lg overflow-hidden h-auto">
                <TabsTrigger value="biomarkers" className="py-3 rounded-none bg-[#fdf3da] data-[state=active]:bg-[#f0c242] data-[state=active]:shadow-none data-[state=active]:font-bold data-[state=active]:text-black">Biomarkers Category</TabsTrigger>
                <TabsTrigger value="outcomes" className="py-3 rounded-none bg-[#fdf3da] data-[state=active]:bg-[#f0c242] data-[state=active]:shadow-none data-[state=active]:font-bold data-[state=active]:text-black">Clinical outcomes</TabsTrigger>
            </TabsList>
            <div className="grid grid-cols-2 gap-px border-2 border-[#f0c242] rounded-lg overflow-hidden bg-[#f0c242]">
                <div className="bg-[#f0c242] text-black p-3 flex items-center justify-center">
                    <span className="font-semibold text-center">How should we do ?</span>
                </div>
                <div className="bg-[#fdf3da] text-black p-3 flex items-center justify-center">
                    <span className="font-bold text-lg">{selectedData.howShouldWeDo}</span>
                </div>
            </div>
        </div>

         <TabsContent value="biomarkers" className="mt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#f0c242] border-2 border-[#f0c242] rounded-lg overflow-hidden">
                <Card className="rounded-none">
                    <CardHeader className="bg-[#f0c242] text-black p-3">
                        <CardTitle className="text-lg font-bold">Diet</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {Object.entries(selectedData.diet).map(([title, text]) => (
                            <div key={title}>
                                <h4 className="font-semibold">{title}</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="rounded-none">
                    <CardHeader className="bg-[#fdf3da] text-black p-3">
                        <CardTitle className="text-lg font-bold">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {Object.entries(selectedData.recommendations).map(([title, points]) => (
                            <div key={title}>
                                <h4 className="font-semibold">{title}</h4>
                                {Array.isArray(points) ? (
                                    <ul className="list-disc pl-5 space-y-1 mt-1">
                                        {points.map((point, index) => (
                                            <li key={index} className="text-sm text-gray-700">{point}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-700 mt-1">{points}</p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="outcomes" className="mt-6">
            <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                <h2 className="text-2xl font-semibold">Clinical Outcomes for {selectedKey}</h2>
                <p>Content for clinical outcomes will be displayed here.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
