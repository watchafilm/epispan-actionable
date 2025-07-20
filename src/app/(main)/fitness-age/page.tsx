import { getItems } from '@/lib/data';
import { FitnessAgeClientPage } from './client-page';
import type { FitnessAgeItem } from '@/lib/definitions';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function FitnessAgePage() {
  const items = await getItems('FitnessAge') as FitnessAgeItem[];

  const fitnessData = items.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {} as Record<string, FitnessAgeItem>);


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
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-6">
              <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold text-[#4287c7] tracking-wider whitespace-nowrap">FITNESS AGE</h1>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[#4287c7] text-sm max-w-4xl">
                  Incorporating physical fitness measurements into epigenetic clocks enhances the detection of lifestyle, medical, and environmental impacts on aging. The DNAmFitAgeAccel algorithm, developed by UCLA researchers, estimates epigenetic age acceleration based on fitness. A modified version, called OMICm FitAge, integrates the OMICm Age algorithm (developed with Harvard) to estimate biological age based on physical fitness and functionality.
                </p>
              </div>
          </div>
          <hr className="h-1 bg-[#4287c7] border-0 rounded mt-2" />
        </div>
      </div>
      
      {Object.keys(fitnessData).length > 0 ? (
        <FitnessAgeClientPage data={fitnessData} />
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold">No data available</h2>
          <p>Please check back later or add data in the editor panel.</p>
        </div>
      )}
    </div>
  );
}
