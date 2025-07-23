'use client';

import { useState } from 'react';
import type { OverallAgeItem } from '@/lib/definitions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplet, Flame, HeartPulse } from 'lucide-react';

type OverallAgeClientPageProps = {
  data: Record<string, OverallAgeItem>;
};

export function OverallAgeClientPage({ data }: OverallAgeClientPageProps) {
  const dataKeys = Object.keys(data);
  const [selectedKey, setSelectedKey] = useState(dataKeys[0] || '');

  const selectedData = data[selectedKey];

  if (!selectedData) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-semibold">No data available</h2>
        <p>Please select an item or add data in the editor panel.</p>
      </div>
    );
  }

  const recommendationSections = [
    { title: 'Description', value: selectedData.description, icon: Leaf, color: 'bg-green-700' },
    { title: 'Diets', value: selectedData.diets, icon: Droplet, color: 'bg-green-600' },
    { title: 'Exercise', value: selectedData.exercise, icon: Flame, color: 'bg-green-500' },
    { title: 'Lifestyle', value: selectedData.lifestyle, icon: HeartPulse, color: 'bg-green-400' },
  ];

  return (
    <div className="space-y-4">
       <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 space-y-4 lg:space-y-0">
        {dataKeys.length > 1 && (
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Click -></span>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-[200px] bg-card border-green-500/50">
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
      </div>
      
      <div className="p-4 bg-green-50/50 rounded-lg">
        <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedData.description }} />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        <Card className="flex flex-col">
          <CardHeader className='text-white rounded-t-lg bg-green-600 p-3'>
            <CardTitle className="flex items-center gap-2 text-md font-bold">
              <Droplet className="w-5 h-5" />
              Diets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-grow">
            <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: selectedData.diets }} />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className='text-white rounded-t-lg bg-green-500 p-3'>
            <CardTitle className="flex items-center gap-2 text-md font-bold">
              <Flame className="w-5 h-5" />
              Exercise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-grow">
            <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: selectedData.exercise }} />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className='text-white rounded-t-lg bg-green-400 p-3'>
            <CardTitle className="flex items-center gap-2 text-md font-bold">
              <HeartPulse className="w-5 h-5" />
              Lifestyle
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-grow">
            <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: selectedData.lifestyle }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
