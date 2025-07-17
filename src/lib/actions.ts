'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addItem, updateItem, deleteItem } from './data';
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
    redirect('/admin/dashboard');
  } else {
    // In a real app, you would handle this more gracefully
    // For now, we redirect back to login
    redirect('/admin/login?error=InvalidCredentials');
  }
}

export async function logout() {
  cookies().delete('auth');
  redirect('/admin/login');
}

const itemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['FitnessAge', 'Symphony', 'EBPS Intervention', 'Reference']),
  value: z.string().min(1, 'Value is required'),
  description: z.string().min(1, 'Description is required'),
  buttonText: z.string().min(1, 'Button text is required'),
  buttonLink: z.string().url('Must be a valid URL').or(z.literal('#')),
});

export async function saveItemAction(id: string | null, data: Omit<Item, 'id'>) {
  try {
    const validatedData = itemSchema.parse(data);

    if (id) {
      await updateItem(id, validatedData);
    } else {
      await addItem(validatedData);
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/(main)/' + validatedData.category.toLowerCase().replace(' ', '-'));
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Validation failed: ' + error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function deleteItemAction(id: string) {
  try {
    await deleteItem(id);
    revalidatePath('/admin/dashboard');
    // Also revalidate all public pages as we don't know the category here easily
    revalidatePath('/(main)', 'layout');
    return { success: true };
  } catch (error) {
     return { success: false, message: 'Failed to delete item.' };
  }
}
