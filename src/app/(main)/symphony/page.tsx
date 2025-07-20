import { getItems } from '@/lib/data';
import type { SymphonyAgeItem } from '@/lib/definitions';
import { SymphonyClientPage } from './client-page';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function SymphonyPage() {
  const items = (await getItems('Symphony')) as SymphonyAgeItem[];

  const symphonyData = items.reduce(
    (acc, item) => {
      acc[item.title] = item;
      return acc;
    },
    {} as Record<string, SymphonyAgeItem>
  );

  return (
    <div className="container mx-auto py-6 px-4">
       <div className="grid grid-cols-12 items-center gap-x-6 mb-8">
        <div className="col-span-2 flex-shrink-0">
          <Image
            src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp"
            alt="Genfosis Logo"
            width={120}
            height={32}
            priority
          />
        </div>
        <div className="col-span-10">
          <div className="flex items-center gap-x-8">
            <h1 className="text-4xl font-bold text-[#D95B5B] tracking-wider">SymphonyAge</h1>
            <p className="text-[#D95B5B] text-sm max-w-2xl">
              By evaluating 130 biomarkers, this comprehensive approach enables precise assessment of aging across 11 distinct organ systems, providing detailed insights into their unique aging patterns.
            </p>
          </div>
          <hr className="h-1 bg-[#D95B5B] border-0 rounded mt-2" />
        </div>
      </div>
      
      {Object.keys(symphonyData).length > 0 ? (
        <SymphonyClientPage data={symphonyData} />
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold">No data available</h2>
          <p>Please check back later or add data in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
