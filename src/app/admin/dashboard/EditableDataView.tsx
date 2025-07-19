'use client';

import { useState } from 'react';
import type { BaseItem, Item, FitnessAgeItem, EBPSInterventionItem, SymphonyItem, ReferenceItem } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, PlusCircle, Trash2, Dumbbell, Utensils, PersonStanding } from 'lucide-react';
import { ItemDialog } from './ItemDialog';
import { deleteItemAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

const AdminCardActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div className="absolute top-2 right-2 flex gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-md">
        <Button variant="outline" size="icon" onClick={onEdit} className="h-8 w-8">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
        </Button>
        <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8"
        >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
        </Button>
    </div>
);


const FitnessAgeCard = ({ item, onEdit, onDelete }: { item: FitnessAgeItem, onEdit: () => void; onDelete: () => void; }) => {
    const recommendationSections = [
        { title: 'Diet', value: item.diet, icon: Utensils, color: 'bg-[#4285F4]' },
        { title: 'Exercise', value: item.exercise, icon: Dumbbell, color: 'bg-[#6C9DFF]' },
        { title: 'Lifestyle', value: item.lifestyle, icon: PersonStanding, color: 'bg-[#A5C2FF]' },
    ];
    return (
        <Card className="relative w-full">
             <AdminCardActions onEdit={onEdit} onDelete={onDelete} />
            <CardHeader>
                <CardTitle className="text-primary">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Definition</h3>
                    <div className="p-3 bg-blue-100/60 rounded-lg">
                        <p className="text-sm text-gray-700">{item.definition}</p>
                    </div>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Related disease</h3>
                    <div className="p-3 bg-blue-100/60 rounded-lg">
                        <p className="text-sm text-gray-700">{item.relatedDisease}</p>
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
                        <ul className="space-y-2 text-sm text-foreground list-disc pl-5">
                            {section.value.split('\n\n').map((point, index) => (
                                <li key={index} className="whitespace-pre-wrap">{point}</li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
};

const EBPSCard = ({ item, onEdit, onDelete }: { item: EBPSInterventionItem, onEdit: () => void; onDelete: () => void; }) => {
    return (
    <Card className="relative w-full space-y-6 p-4">
      <AdminCardActions onEdit={onEdit} onDelete={onDelete} />
      <div className="flex items-start gap-4">
           <h3 className="font-semibold text-[#f0c242] whitespace-nowrap pt-2">Description</h3>
           <p className="text-sm text-gray-700 whitespace-pre-wrap bg-[#fdf3da] p-4 rounded-lg flex-grow">{item.description}</p>
      </div>

       <div className="grid grid-cols-2 gap-x-6">
         <div className="grid grid-cols-2 gap-px border-2 border-[#f0c242] rounded-lg overflow-hidden bg-[#f0c242]">
            <div className="bg-[#f0c242] text-black p-3 flex items-center justify-center">
                <span className="font-semibold text-center">Biomarkers Category</span>
            </div>
            <div className="bg-[#fdf3da] text-black p-3 flex items-center justify-center">
                <span className="font-bold text-lg">{item.clinicalOutcomes}</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-px border-2 border-[#f0c242] rounded-lg overflow-hidden bg-[#f0c242]">
            <div className="bg-[#f0c242] text-black p-3 flex items-center justify-center">
                <span className="font-semibold text-center">How should we do ?</span>
            </div>
            <div className="bg-[#fdf3da] text-black p-3 flex items-center justify-center">
                <span className="font-bold text-lg">{item.howShouldWeDo}</span>
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
                    {Object.entries(item.diet).map(([title, text]) => (
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
                    {Object.entries(item.recommendations).map(([title, points]) => (
                        <div key={title}>
                            <h4 className="font-semibold">{title}</h4>
                            {Array.isArray(points) ? (
                                <ul className="list-disc pl-5 space-y-1 mt-1">
                                    {points.map((point, index) => (
                                        <li key={index} className="text-sm text-gray-700">{point}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{points as string}</p>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </Card>
    )
};

const SimpleCard = ({ item, onEdit, onDelete }: { item: SymphonyItem | ReferenceItem, onEdit: () => void; onDelete: () => void; }) => (
    <Card className="relative flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20">
        <AdminCardActions onEdit={onEdit} onDelete={onDelete} />
        <CardHeader>
            <CardTitle className="text-xl font-bold font-headline text-primary-foreground bg-primary/80 -m-6 p-6 rounded-t-lg">
            {item.title}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-4xl font-bold text-foreground mb-2">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
        {item.buttonLink && item.buttonText && (
          <CardFooter>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-bold">
              <Link href={item.buttonLink}>{item.buttonText}</Link>
              </Button>
        </CardFooter>
        )}
    </Card>
);


export default function EditableDataView({ items, category }: { items: Item[], category: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BaseItem | null>(null);
  const { toast } = useToast();

  const handleEdit = (item: BaseItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleDelete = (item: BaseItem) => {
    setItemToDelete(item);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const result = await deleteItemAction(itemToDelete.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Item deleted successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
      setItemToDelete(null);
    }
    setDeleteAlertOpen(false);
  };
  
  const renderItem = (item: Item) => {
    switch (item.category) {
        case 'FitnessAge':
            return <FitnessAgeCard key={item.id} item={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />;
        case 'EBPS Intervention':
             return <EBPSCard key={item.id} item={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />;
        case 'Symphony':
        case 'Reference':
            return <SimpleCard key={item.id} item={item} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />;
        default:
            return null;
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New {category} Item
        </Button>
      </div>
      <div className="space-y-4">
        {items.map(renderItem)}
      </div>

      <ItemDialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          setDialogOpen(isOpen);
          if (!isOpen) {
            setSelectedItem(null);
          }
        }}
        item={selectedItem}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              "{itemToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
