'use client';

import { useState } from 'react';
import type { SymphonyAgeItem } from '@/lib/definitions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Utensils, PersonStanding } from 'lucide-react';

type SymphonyClientPageProps = {
  data: Record<string, SymphonyAgeItem>;
};

export function SymphonyClientPage({ data }: SymphonyClientPageProps) {
  const dataKeys = Object.keys(data);
  const [selectedKey, setSelectedKey] = useState(dataKeys[0] || '');

  const selectedData = data[selectedKey];

  if (!selectedData) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-semibold">No data available</h2>
        <p>Please select an item or add data in the admin panel.</p>
      </div>
    );
  }

  const recommendationSections = [
    { title: 'Diet', value: selectedData.diet, icon: Utensils, color: 'bg-[#C0392B]' },
    { title: 'Exercise', value: selectedData.exercise, icon: Dumbbell, color: 'bg-[#D95B5B]' },
    { title: 'Lifestyle', value: selectedData.lifestyle, icon: PersonStanding, color: 'bg-[#E78282]' },
  ];

  return (
    <div className="space-y-4">
       <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 space-y-4 lg:space-y-0">
        {dataKeys.length > 0 && (
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Click -></span>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-[200px] bg-card border-destructive/50">
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

        <div className="flex-grow space-y-2">
            <h3 className="font-semibold text-[#D95B5B]">{selectedData.title}</h3>
            <div className="p-3 bg-red-100/60 rounded-lg h-full">
                <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedData.definition }} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendationSections.map((section) => (
          <Card key={section.title} className="flex flex-col">
            <CardHeader className={`text-white rounded-t-lg ${section.color} p-3`}>
              <CardTitle className="flex items-center gap-2 text-md font-bold">
                <section.icon className="w-5 h-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex-grow">
               <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: section.value }}/>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
