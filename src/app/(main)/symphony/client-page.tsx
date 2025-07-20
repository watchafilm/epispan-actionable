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
import type { SymphonyAgeItem } from '@/lib/definitions';

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
    { title: 'Diet', value: selectedData.diet, color: 'bg-[#C0392B]' },
    { title: 'Exercise', value: selectedData.exercise, color: 'bg-[#D95B5B]' },
    { title: 'Lifestyle', value: selectedData.lifestyle, color: 'bg-[#E78282]' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Click -&gt;</span>
        <Select value={selectedKey} onValueChange={setSelectedKey}>
          <SelectTrigger className="w-[280px] bg-black text-white border-black">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-300 border border-gray-300">
        {recommendationSections.map((section, index) => (
          <div key={section.title} className="flex flex-col bg-white">
            <h2 className={`text-white text-lg font-bold p-3 ${section.color}`}>
              {section.title}
            </h2>
            <div className="p-4 flex-grow prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.value }} />
          </div>
        ))}
      </div>
    </div>
  );
}
