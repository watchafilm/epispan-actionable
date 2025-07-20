import { getAllItems, getItems } from '@/lib/data';
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle } from 'lucide-react';
import type { Item, FitnessAgeItem, EBPSInterventionItem, SymphonyAgeItem } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

import { FitnessAgeClientPage } from '@/app/(main)/fitness-age/client-page';
import { EBPSInterventionClientPage } from '@/app/(main)/ebps-intervention/client-page';
import { SymphonyClientPage } from '@/app/(main)/symphony/client-page';
import { EditableWrapper } from './EditableWrapper';
import { ItemDialog } from './ItemDialog';

export const dynamic = 'force-dynamic';

export default async function EditorDashboardPage() {
  const allItems = (await getAllItems()) as Item[];
  const fitnessItems = allItems.filter(item => item.category === 'FitnessAge') as FitnessAgeItem[];
  const ebpsItems = allItems.filter(item => item.category === 'EBPS Intervention') as EBPSInterventionItem[];
  const symphonyItems = allItems.filter(item => item.category === 'Symphony') as SymphonyAgeItem[];
  
  const fitnessData = fitnessItems.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {} as Record<string, FitnessAgeItem>);

  const ebpsData = ebpsItems.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {} as Record<string, EBPSInterventionItem>);

  const symphonyData = symphonyItems.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {} as Record<string, SymphonyAgeItem>);


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold font-headline">Editor Dashboard</h1>
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
        <Tabs defaultValue="fitness-age" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="fitness-age">FitnessAge</TabsTrigger>
            <TabsTrigger value="ebps-intervention">EBPS Intervention</TabsTrigger>
            <TabsTrigger value="symphony">Symphony</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fitness-age">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Fitness Age Page</h2>
                 <EditableWrapper item={null} category="FitnessAge">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New FitnessAge Item
                    </Button>
                 </EditableWrapper>
              </div>

              <div className="container mx-auto py-6 px-4 border rounded-md">
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
                    Object.values(fitnessData).map(item => (
                       <EditableWrapper key={item.id} item={item} category="FitnessAge">
                          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg my-4 relative hover:border-blue-500 transition-all">
                               <FitnessAgeClientPage data={{ [item.title]: item }} />
                          </div>
                       </EditableWrapper>
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                      <p>No FitnessAge items yet. Click "Add New" to create one.</p>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ebps-intervention">
             <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">EBPS Intervention Page</h2>
                   <EditableWrapper item={null} category="EBPS Intervention">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New EBPS Item
                      </Button>
                   </EditableWrapper>
                </div>

                <div className="container mx-auto py-6 px-4 border rounded-md">
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
                  
                  {Object.keys(ebpsData).length > 0 ? (
                    Object.values(ebpsData).map(item => (
                       <EditableWrapper key={item.id} item={item} category="EBPS Intervention">
                          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg my-4 relative hover:border-yellow-500 transition-all">
                               <EBPSInterventionClientPage data={{ [item.title]: item }} />
                          </div>
                       </EditableWrapper>
                    ))
                   ) : (
                    <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                      <p>No EBPS Intervention items yet. Click "Add New" to create one.</p>
                    </div>
                  )}
                </div>
             </div>
          </TabsContent>

          <TabsContent value="symphony">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Symphony Age Page</h2>
                  <EditableWrapper item={null} category="Symphony">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Symphony Item
                    </Button>
                  </EditableWrapper>
              </div>

              <div className="container mx-auto py-6 px-4 border rounded-md">
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
                    Object.values(symphonyData).map(item => (
                      <EditableWrapper key={item.id} item={item} category="Symphony">
                        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg my-4 relative hover:border-red-500 transition-all">
                          <SymphonyClientPage data={{ [item.title]: item }} />
                        </div>
                      </EditableWrapper>
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                      <p>No Symphony items yet. Click "Add New" to create one.</p>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
