import { getItems } from '@/lib/data';
import { EBPSInterventionClientPage } from './client-page';
import type { EBPSInterventionItem } from '@/lib/definitions';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function EBPSInterventionPage() {
  const items = await getItems('EBPS Intervention') as EBPSInterventionItem[];
  
  const pageData = items.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {} as Record<string, EBPSInterventionItem>);


  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-12 items-center gap-x-6 mb-4">
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
              <h1 className="text-4xl font-bold text-[#c09103] tracking-wider">EBPs</h1>
              <p className="text-[#c09103] text-sm max-w-2xl">
                Epigenetic Biomarker Proxies (EBPs) are DNA methylation-based predictors that estimate biomarker levels without the need for direct laboratory testing. EBPs can offer valuable insights in specific contexts. For example, DNAmCRP, a proxy for C-reactive protein, has been linked to brain health outcomes.
              </p>
          </div>
          <hr className="h-1 bg-[#c09103] border-0 rounded mt-2" />
        </div>
      </div>
      
      <EBPSInterventionClientPage data={pageData} />
    </div>
  );
}
