'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addItem, updateItem, deleteItem, getItems, updateItemsOrder } from './data';
import type { Item } from './definitions';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'genfosis';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sisfogen';

export async function login(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookies().set('auth', ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
    redirect('/edit/dashboard');
  } else {
    redirect('/edit/login?error=InvalidCredentials');
  }
}

export async function logout() {
  cookies().delete('auth');
  redirect('/edit/login');
}

// Base schema for order field, to be extended
const baseSchema = z.object({
  order: z.coerce.number().optional(),
});

const fitnessAgeSchema = baseSchema.extend({
  title: z.string().min(1, 'Title is required'),
  definition: z.string().min(1, 'Definition is required'),
  relatedDisease: z.string().min(1, 'Related disease is required'),
  diet: z.string().min(1, 'Diet is required'),
  exercise: z.string().min(1, 'Exercise is required'),
  lifestyle: z.string().min(1, 'Lifestyle is required'),
});

const ebpsSchema = baseSchema.extend({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    howShouldWeDo: z.string().min(1, "How should we do is required"),
    biomarkersCategory: z.string().min(1, "Biomarkers category is required"),
    diet: z.string().min(1, "Diet is required"),
    recommendations: z.string().min(1, "Recommendations is required"),
});

const symphonySchema = baseSchema.extend({
  title: z.string().min(1, 'Title is required'),
  diet: z.string().min(1, 'Diet is required'),
  exercise: z.string().min(1, 'Exercise is required'),
  lifestyle: z.string().min(1, 'Lifestyle is required'),
});

const referenceSchema = baseSchema.extend({
    title: z.string().min(1, 'Title is required'),
    value: z.string().min(1, 'Value is required'),
    description: z.string().min(1, 'Description is required'),
    buttonText: z.string().optional(),
    buttonLink: z.string().url('Must be a valid URL').or(z.literal('#')).optional(),
});


export async function saveItemAction(id: string | null, category: Item['category'], formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  let schema;
  switch (category) {
    case 'FitnessAge':
      schema = fitnessAgeSchema;
      break;
    case 'EBPS Intervention':
      schema = ebpsSchema;
      break;
    case 'Symphony':
      schema = symphonySchema;
      break;
    case 'Reference':
      schema = referenceSchema;
      break;
    default:
      return { success: false, message: 'Invalid category' };
  }
  
  try {
    const validatedData = schema.parse(data);
    const finalData = { ...validatedData, category };

    if (id) {
      await updateItem(id, finalData);
    } else {
      await addItem(finalData);
    }

    revalidatePath('/edit/dashboard');
    const path = `/${category.toLowerCase().replace(/\s+/g, '-')}`;
    revalidatePath(path);
    if(path.startsWith('/')) revalidatePath(path.substring(1));


    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Validation failed: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    console.error("Save item error:", error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function deleteItemAction(id: string) {
  try {
    // Before deleting, get the category to reorder remaining items
    const items = await getItems('FitnessAge').then(fa => getItems('EBPS Intervention').then(ebps => getItems('Symphony').then(s => getItems('Reference').then(r => [...fa, ...ebps, ...s, ...r]))));
    const itemToDelete = items.find(i => i.id === id);
    
    if (!itemToDelete) {
      throw new Error('Item not found');
    }
    
    await deleteItem(id);

    // Reorder remaining items
    const remainingItems = await getItems(itemToDelete.category);
    const orderedItems = remainingItems.map((item, index) => ({ id: item.id, order: index }));
    await updateItemsOrder(orderedItems);

    revalidatePath('/edit/dashboard');
    revalidatePath('/(main)', 'layout');
    return { success: true };
  } catch (error) {
     console.error("Delete item error:", error);
     return { success: false, message: 'Failed to delete item.' };
  }
}

export async function updateItemOrderAction(itemId: string, direction: 'up' | 'down', category: Item['category']) {
  try {
    const items = await getItems(category);
    const currentIndex = items.findIndex(item => item.id === itemId);

    if (currentIndex === -1) {
      return { success: false, message: 'Item not found' };
    }
    if (direction === 'up' && currentIndex === 0) {
      return { success: true }; // Already at the top
    }
    if (direction === 'down' && currentIndex === items.length - 1) {
      return { success: true }; // Already at the bottom
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap orders
    const currentItem = items[currentIndex];
    const targetItem = items[targetIndex];

    const updates = [
      { id: currentItem.id, order: targetItem.order },
      { id: targetItem.id, order: currentItem.order }
    ];

    await updateItemsOrder(updates);
    
    revalidatePath('/edit/dashboard');
    const path = `/${category.toLowerCase().replace(/\s+/g, '-')}`;
    revalidatePath(path);
     if(path.startsWith('/')) revalidatePath(path.substring(1));

    return { success: true };
  } catch (error) {
    console.error("Update order error:", error);
    return { success: false, message: 'Failed to update item order.' };
  }
}
