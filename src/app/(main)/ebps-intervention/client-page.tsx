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

type EBPSData = {
  [key: string]: {
    description: string;
    howShouldWeDo: string;
    biomarkersCategory: string;
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
      <div className="grid grid-cols-12 items-start gap-x-6 p-4 rounded-md">
        {dataKeys.length > 0 && (
        <div className="col-span-3 flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Click -></span>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-full bg-transparent text-black border-[#f0c242]">
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
        )}
        <div className="col-span-9 flex items-start gap-4">
           <h3 className="font-semibold text-[#f0c242] whitespace-nowrap pt-2">Description</h3>
           <div className="text-sm text-gray-700 bg-[#fdf3da] p-4 rounded-lg prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedData.description }} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-6">
         <div className="grid grid-cols-2 gap-px border-2 border-[#f0c242] rounded-lg overflow-hidden bg-[#f0c242]">
            <div className="bg-[#f0c242] text-black p-3 flex items-center justify-center">
                <span className="font-semibold text-center">Biomarkers Category</span>
            </div>
            <div className="bg-[#fdf3da] text-black p-3 flex items-center justify-center">
                <div className="font-bold text-lg prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedData.biomarkersCategory }}></div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-px border-2 border-[#f0c242] rounded-lg overflow-hidden bg-[#f0c242]">
            <div className="bg-[#f0c242] text-black p-3 flex items-center justify-center">
                <span className="font-semibold text-center">How should we do ?</span>
            </div>
            <div className="bg-[#fdf3da] text-black p-3 flex items-center justify-center">
                <div className="font-bold text-lg prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedData.howShouldWeDo }}></div>
            </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#f0c242] border-2 border-[#f0c242] rounded-lg overflow-hidden">
            <Card className="rounded-none">
                <CardHeader className="bg-[#f0c242] text-black p-3">
                    <CardTitle className="text-lg font-bold">Diet</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {selectedData.diet && Object.entries(selectedData.diet).map(([title, text]) => (
                        <div key={title}>
                            <h4 className="font-semibold">{title}</h4>
                            <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: text }}></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="rounded-none">
                <CardHeader className="bg-[#fdf3da] text-black p-3">
                    <CardTitle className="text-lg font-bold">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {selectedData.recommendations && Object.entries(selectedData.recommendations).map(([title, points]) => (
                        <div key={title}>
                            <h4 className="font-semibold">{title}</h4>
                            {Array.isArray(points) ? (
                                <ul className="list-disc pl-5 space-y-1 mt-1 prose prose-sm max-w-none">
                                    {points.map((point, index) => (
                                        <li key={index} className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: point }}></li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-gray-700 mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: points as string }}></div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
