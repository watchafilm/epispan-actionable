
import { getItems } from '@/lib/data';
import type { ReferenceItem } from '@/lib/definitions';
import { ReferenceItemDisplay } from '@/components/ReferenceItem';

export const dynamic = 'force-dynamic';

export default async function ReferencePage() {
  const allReferences = (await getItems('Reference')) as ReferenceItem[];

  const referencesByCategory = allReferences.reduce((acc, ref) => {
    // Filter out items with no subCategory
    if (!ref.subCategory) {
      return acc;
    }
    
    const { subCategory } = ref;
    if (!acc[subCategory]) {
      acc[subCategory] = [];
    }
    acc[subCategory].push(ref);
    return acc;
  }, {} as Record<string, ReferenceItem[]>);

  const categories = Object.keys(referencesByCategory).sort();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 font-headline text-primary">
        References
      </h1>

      <div className="space-y-12">
        {categories.length > 0 ? (
          categories.map((category) => (
            <section key={category}>
              <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
                {category}
              </h2>
              <div className="space-y-4">
                {referencesByCategory[category].map((ref) => (
                  <ReferenceItemDisplay key={ref.id} reference={ref} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
            <h2 className="text-2xl font-semibold">No References Found</h2>
            <p>Add references in the editor to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
