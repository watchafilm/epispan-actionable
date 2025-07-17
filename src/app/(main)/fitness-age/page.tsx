import { getItems } from '@/lib/data';
import { InfoCard } from '@/components/InfoCard';

export const dynamic = 'force-dynamic';

export default async function FitnessAgePage() {
  const items = await getItems('FitnessAge');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 font-headline">FitnessAge Insights</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <InfoCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold">No data available</h2>
          <p>Please check back later or add data in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
