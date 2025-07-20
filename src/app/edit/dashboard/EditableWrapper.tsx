'use client';

import { useState } from 'react';
import type { Item } from '@/lib/definitions';
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
import { Edit, PlusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ItemDialog } from './ItemDialog';
import { deleteItemAction, updateItemOrderAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface EditableWrapperProps {
  item: Item | null;
  category: Item['category'];
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}

export function EditableWrapper({ item, category, children, isFirst, isLast }: EditableWrapperProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (item) {
      setIsPending(true);
      const result = await deleteItemAction(item.id);
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
      setIsPending(false);
    }
    setDeleteAlertOpen(false);
  };
  
  const handleMove = async (direction: 'up' | 'down') => {
    if (item) {
        setIsPending(true);
        const result = await updateItemOrderAction(item.id, direction, item.category);
        if (!result.success) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message,
            });
        }
        setIsPending(false);
    }
  };


  if (!item) {
    // This is for the "Add New" button
    return (
      <>
        <div onClick={handleEdit}>{children}</div>
        <ItemDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            item={null}
            category={category}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative group">
        <div className="absolute top-2 right-2 z-10 flex gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" onClick={() => handleMove('up')} className="h-8 w-8" disabled={isFirst || isPending}>
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Move Up</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleMove('down')} className="h-8 w-8" disabled={isLast || isPending}>
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Move Down</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleEdit} className="h-8 w-8" disabled={isPending}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} className="h-8 w-8" disabled={isPending}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
        {children}
      </div>

      <ItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={item}
        category={category}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item "{item?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
