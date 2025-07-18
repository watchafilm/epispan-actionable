'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { BaseItem, Item } from '@/lib/definitions';
import { saveItemAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

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

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: BaseItem | null;
}

export function ItemDialog({ open, onOpenChange, item }: ItemDialogProps) {
  const { toast } = useToast();
  const [fullItem, setFullItem] = useState<Item | null>(null);
  
  const form = useForm({
    defaultValues: {
      category: item?.category || 'FitnessAge',
      title: '',
      // Common fields
      value: '',
      description: '',
      buttonText: '',
      buttonLink: '#',
      // FitnessAge fields
      definition: '',
      relatedDisease: '',
      diet: '',
      exercise: '',
      lifestyle: '',
      // EBPS fields
      howShouldWeDo: '',
      clinicalOutcomes: '',
      // Note: diet & recommendations for EBPS are handled as JSON strings in textareas
    },
  });
  
  const watchedCategory = useWatch({
    control: form.control,
    name: "category"
  });

  useEffect(() => {
    if (item?.id) {
      getItemById(item.id).then(data => {
        if (data) {
          setFullItem(data);
          const defaultValues: any = { category: data.category };
          
          Object.keys(data).forEach(key => {
            const typedKey = key as keyof typeof data;
            const value = data[typedKey];
            if(typeof value === 'object' && value !== null){
                defaultValues[typedKey] = JSON.stringify(value, null, 2);
            } else {
                defaultValues[typedKey] = value;
            }
          });
          form.reset(defaultValues);
        }
      });
    } else {
      setFullItem(null);
      form.reset({
        category: 'FitnessAge',
        title: '',
        value: '',
        description: '',
        buttonText: '',
        buttonLink: '#',
        definition: '',
        relatedDisease: '',
        diet: '',
        exercise: '',
        lifestyle: '',
        howShouldWeDo: '',
        clinicalOutcomes: '',
      });
    }
  }, [item, form]);


  const onSubmit = async (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
    });
    
    const result = await saveItemAction(fullItem?.id || null, watchedCategory, formData);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: `Item ${fullItem?.id ? 'updated' : 'created'} successfully.`,
      });
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };

  const renderFormFields = () => {
    switch (watchedCategory) {
      case 'FitnessAge':
        return (
          <>
            <FormField control={form.control} name="definition" render={({ field }) => (
                <FormItem><FormLabel>Definition</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="relatedDisease" render={({ field }) => (
                <FormItem><FormLabel>Related Disease</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="diet" render={({ field }) => (
                <FormItem><FormLabel>Diet</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="exercise" render={({ field }) => (
                <FormItem><FormLabel>Exercise</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="lifestyle" render={({ field }) => (
                <FormItem><FormLabel>Lifestyle</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
            )}/>
          </>
        );
      case 'EBPS Intervention':
        return (
            <>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="howShouldWeDo" render={({ field }) => (
                    <FormItem><FormLabel>How should we do?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="clinicalOutcomes" render={({ field }) => (
                    <FormItem><FormLabel>Clinical Outcomes</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="diet" render={({ field }) => (
                    <FormItem><FormLabel>Diet (JSON)</FormLabel><FormControl><Textarea {...field} rows={8} placeholder='{ "key": "value" }' /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="recommendations" render={({ field }) => (
                    <FormItem><FormLabel>Recommendations (JSON)</FormLabel><FormControl><Textarea {...field} rows={8} placeholder='{ "key": "value" or ["value1", "value2"] }' /></FormControl><FormMessage /></FormItem>
                )}/>
            </>
        )
      case 'Symphony':
      case 'Reference':
        return (
          <>
            <FormField control={form.control} name="value" render={({ field }) => (
                <FormItem><FormLabel>Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="buttonText" render={({ field }) => (
                <FormItem><FormLabel>Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="buttonLink" render={({ field }) => (
                <FormItem><FormLabel>Button Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Make changes to the item here.' : 'Add a new item to the list.'} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!item}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FitnessAge">FitnessAge</SelectItem>
                      <SelectItem value="EBPS Intervention">EBPS Intervention</SelectItem>
                      <SelectItem value="Symphony">Symphony</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>

            {renderFormFields()}

            <DialogFooter className="sticky bottom-0 bg-background py-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
