'use client';

import { useState } from 'react';
import type { Item } from '@/lib/definitions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Utensils, PersonStanding, HeartPulse, Stethoscope, FileText } from 'lucide-react';

type FitnessDataItem = Item & {
  definition: string;
  relatedDisease: string;
  diet: string;
  exercise: string;
  lifestyle: string;
};

type FitnessAgeClientPageProps = {
  data: Record<string, FitnessDataItem>;
};

export function FitnessAgeClientPage({ data }: FitnessAgeClientPageProps) {
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

  const infoSections = [
    { title: 'Definition', value: selectedData.definition, icon: FileText },
    { title: 'Related Disease', value: selectedData.relatedDisease, icon: Stethoscope },
  ];

  const recommendationSections = [
    { title: 'Diet', value: selectedData.diet, icon: Utensils, color: 'bg-blue-500' },
    { title: 'Exercise', value: selectedData.exercise, icon: Dumbbell, color: 'bg-green-500' },
    { title: 'Lifestyle', value: selectedData.lifestyle, icon: PersonStanding, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Click -&gt;</span>
        <Select value={selectedKey} onValueChange={setSelectedKey}>
          <SelectTrigger className="w-[200px] bg-card border-primary/50">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoSections.map(section => (
            <Card key={section.title} className="bg-muted/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-md font-semibold flex items-center gap-2 text-primary">
                        <section.icon className="w-4 h-4" />
                        {section.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.value}</p>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendationSections.map((section) => (
          <Card key={section.title} className="flex flex-col">
            <CardHeader className={`text-primary-foreground rounded-t-lg ${section.color} p-4`}>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <section.icon className="w-5 h-5" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-grow">
              <p className="text-sm text-foreground whitespace-pre-wrap">{section.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
