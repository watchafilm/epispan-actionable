'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { Item, FitnessAgeItem, EBPSInterventionItem, ReferenceItem } from '@/lib/definitions';
import { saveItemAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getItemById } from '@/lib/data';
import { TiptapEditor } from '@/components/TiptapEditor';

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  category: Item['category'];
}

const fitnessAgeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  definition: z.string().min(1, 'Definition is required'),
  relatedDisease: z.string().min(1, 'Related disease is required'),
  diet: z.string().min(1, 'Diet is required'),
  exercise: z.string().min(1, 'Exercise is required'),
  lifestyle: z.string().min(1, 'Lifestyle is required'),
});

const ebpsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    howShouldWeDo: z.string().min(1, "How should we do is required"),
    biomarkersCategory: z.string().min(1, "Biomarkers category is required"),
    diet: z.string().min(1, "Diet is required"),
    recommendations: z.string().min(1, "Recommendations is required"),
});

const symphonySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  diet: z.string().min(1, 'Diet is required'),
  exercise: z.string().min(1, 'Exercise is required'),
  lifestyle: z.string().min(1, 'Lifestyle is required'),
});

const overallAgeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    diets: z.string().min(1, 'Diets are required'),
    exercise: z.string().min(1, 'Exercise is required'),
    lifestyle: z.string().min(1, 'Lifestyle is required'),
});


const referenceSchema = z.object({
    title: z.string().optional(), // Title is not used for display but good to have
    text: z.string().min(1, 'Reference text is required'),
    subCategory: z.string().min(1, 'Sub-category is required'),
});


export function ItemDialog({ open, onOpenChange, item, category }: ItemDialogProps) {
  const { toast } = useToast();
  const [fullItem, setFullItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      category: category,
      title: '',
      value: '',
      description: '',
      buttonText: '',
      buttonLink: '#',
      definition: '',
      relatedDisease: '',
      diet: '',
      diets: '',
      exercise: '',
      lifestyle: '',
      howShouldWeDo: '',
      biomarkersCategory: '',
      recommendations: '',
      text: '',
      subCategory: '',
      order: 0,
    },
  });

  useEffect(() => {
    form.reset({ category: category });
    if (item?.id) {
        setIsLoading(true);
        getItemById(item.id).then(data => {
            if (data) {
                setFullItem(data);
                const defaultValues: any = { category: data.category };
                
                Object.keys(data).forEach(key => {
                    const typedKey = key as keyof typeof data;
                    const value = data[typedKey];
                    defaultValues[typedKey] = value === null || value === undefined ? '' : value;
                });
                form.reset(defaultValues);
            }
            setIsLoading(false);
        });
    } else {
      setFullItem(null);
      form.reset({
        category: category,
        title: '',
        value: '',
        description: '',
        buttonText: '',
        buttonLink: '#',
        definition: '',
        relatedDisease: '',
        diet: '',
        diets: '',
        exercise: '',
        lifestyle: '',
        howShouldWeDo: '',
        biomarkersCategory: '',
        recommendations: '',
        text: '',
        subCategory: '',
        order: 0,
      });
    }
  }, [item, category, open, form]);


  const onSubmit = async (values: any) => {
    // For 'Reference', if it's a new item, we pass the raw text to the action for splitting.
    // If it's an update, the title is already set.
    if (category === 'Reference' && !fullItem?.id && values.text) {
        values.title = 'Multiple items'; // Placeholder, the action will handle individual titles
    } else if (category === 'Reference' && values.text) {
        values.title = values.text.substring(0, 50) + '...';
    }

    const formData = new FormData();
    Object.keys(values).forEach(key => {
        if(values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
        }
    });
    
    const result = await saveItemAction(fullItem?.id || null, category, formData);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: `Item(s) ${fullItem?.id ? 'updated' : 'created'} successfully.`,
      });
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error saving item',
        description: result.message,
      });
    }
  };
  
  const showTitleField = category !== 'Reference';

  const renderFormFields = () => {
    switch (category) {
      case 'FitnessAge':
        return (
          <>
            <FormField control={form.control} name="definition" render={({ field }) => (
                <FormItem><FormLabel>Definition</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="relatedDisease" render={({ field }) => (
                <FormItem><FormLabel>Related Disease</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="diet" render={({ field }) => (
                <FormItem><FormLabel>Diet</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="exercise" render={({ field }) => (
                <FormItem><FormLabel>Exercise</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="lifestyle" render={({ field }) => (
                <FormItem><FormLabel>Lifestyle</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
          </>
        );
      case 'EBPS Intervention':
        return (
            <>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="howShouldWeDo" render={({ field }) => (
                    <FormItem><FormLabel>How should we do?</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="biomarkersCategory" render={({ field }) => (
                    <FormItem><FormLabel>Biomarkers Category</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="diet" render={({ field }) => (
                    <FormItem><FormLabel>Diet</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="recommendations" render={({ field }) => (
                    <FormItem><FormLabel>Recommendations</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                )}/>
            </>
        );
      case 'Symphony':
        return (
          <>
            <FormField control={form.control} name="diet" render={({ field }) => (
                <FormItem><FormLabel>Diet</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="exercise" render={({ field }) => (
                <FormItem><FormLabel>Exercise</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="lifestyle" render={({ field }) => (
                <FormItem><FormLabel>Lifestyle</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
          </>
        );
      case 'OverallAge':
        return (
          <>
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="diets" render={({ field }) => (
                <FormItem><FormLabel>Diets</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="exercise" render={({ field }) => (
                <FormItem><FormLabel>Exercise</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="lifestyle" render={({ field }) => (
                <FormItem><FormLabel>Lifestyle</FormLabel><FormControl><TiptapEditor content={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )}/>
          </>
        );
      case 'Reference':
        return (
          <>
             <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sub-Category</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g., Fitness Age, OVERALL OmicAge" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField control={form.control} name="text" render={({ field }) => (
                <FormItem>
                    <FormLabel>Reference Text</FormLabel>
                    <FormControl>
                        <Textarea 
                            {...field} 
                            rows={item ? 5 : 10} 
                            placeholder={item ? "Edit this reference." : "Add multiple references, one per line."}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? `Edit ${category}` : `Add New ${category}`}</DialogTitle>
          <DialogDescription>
            {item ? 'Make changes to the item here.' : `Add a new ${category} item.`} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        { isLoading ? <p>Loading data...</p> : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
             <FormField control={form.control} name="order" render={({ field }) => ( <FormItem className="hidden"><FormControl><Input type="hidden" {...field} /></FormControl></FormItem> )} />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value} disabled>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FitnessAge">FitnessAge</SelectItem>
                      <SelectItem value="EBPS Intervention">EBPS Intervention</SelectItem>
                      <SelectItem value="Symphony">Symphony</SelectItem>
                      <SelectItem value="OverallAge">OverallAge</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showTitleField && (
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            )}

            {renderFormFields()}

            <DialogFooter className="sticky bottom-0 bg-background py-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
