import { getAllItems } from '@/lib/data';
import EditableDataView from './EditableDataView';
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import type { Item } from '@/lib/definitions';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';


export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const allItems = await getAllItems() as Item[];

  const groupedItems = allItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);
  
  const categories = Object.keys(groupedItems);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold font-headline">Admin Dashboard</h1>
            <form action={logout}>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
                {categories.map(category => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
            </TabsList>
            {categories.map(category => (
                 <TabsContent key={category} value={category}>
                    <EditableDataView items={groupedItems[category]} category={category} />
                 </TabsContent>
            ))}
        </Tabs>
      </main>
    </div>
  );
}
