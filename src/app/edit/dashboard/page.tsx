import { getItems } from '@/lib/data';
import { logout, updateItemOrderAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { LogOut, PlusCircle } from 'lucide-react';
import type { Item, FitnessAgeItem, EBPSInterventionItem, SymphonyAgeItem, ReferenceItem, OverallAgeItem } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

import { FitnessAgeClientPage } from '@/app/(main)/fitness-age/client-page';
import { EBPSInterventionClientPage } from '@/app/(main)/ebps-intervention/client-page';
import { SymphonyClientPage } from '@/app/(main)/symphony/client-page';
import { OverallAgeClientPage } from '@/app/(main)/overall-age/client-page';
import { EditableWrapper } from './EditableWrapper';
import { ItemDialog } from './ItemDialog';
import { ReferenceItemDisplay } from '@/components/ReferenceItem';

export const dynamic = 'force-dynamic';

export default async function EditorDashboardPage() {
  const allItems = (await getItems(null)) as Item[];
  const fitnessItems = allItems.filter(item => item.category === 'FitnessAge').sort((a, b) => a.order - b.order) as FitnessAgeItem[];
  const ebpsItems = allItems.filter(item => item.category === 'EBPS Intervention').sort((a, b) => a.order - b.order) as EBPSInterventionItem[];
  const symphonyItems = allItems.filter(item => item.category === 'Symphony').sort((a, b) => a.order - b.order) as SymphonyAgeItem[];
  const overallAgeItems = allItems.filter(item => item.category === 'OverallAge').sort((a,b) => a.order - b.order) as OverallAgeItem[];
  const referenceItems = allItems.filter(item => item.category === 'Reference').sort((a, b) => a.order - b.order) as ReferenceItem[];
  
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
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="fitness-age">FitnessAge</TabsTrigger>
            <TabsTrigger value="ebps-intervention">EBPS Intervention</TabsTrigger>
            <TabsTrigger value="symphony">SymphonyAge</TabsTrigger>
            <TabsTrigger value="overall-age">OverallAge</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
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

                  {fitnessItems.length > 0 ? (
                    fitnessItems.map((item, index) => (
                       <EditableWrapper 
                          key={item.id} 
                          item={item} 
                          category="FitnessAge"
                          isFirst={index === 0}
                          isLast={index === fitnessItems.length - 1}
                        >
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
                  
                  {ebpsItems.length > 0 ? (
                    ebpsItems.map((item, index) => (
                       <EditableWrapper 
                          key={item.id} 
                          item={item} 
                          category="EBPS Intervention"
                          isFirst={index === 0}
                          isLast={index === ebpsItems.length - 1}
                        >
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

                  {symphonyItems.length > 0 ? (
                    symphonyItems.map((item, index) => (
                      <EditableWrapper 
                        key={item.id} 
                        item={item} 
                        category="Symphony"
                        isFirst={index === 0}
                        isLast={index === symphonyItems.length - 1}
                      >
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
          
          <TabsContent value="overall-age">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Overall Age Page</h2>
                  <EditableWrapper item={null} category="OverallAge">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New OverallAge Item
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
                        <h1 className="text-4xl font-bold text-green-600 tracking-wider">OVERALL OmicAge</h1>
                        <p className="text-green-600 text-sm max-w-2xl">
                         The OMICmAge clock, developed in collaboration with Harvard University, represents a significant advancement in biological age assessment. By integrating multi-omics data, it provides a comprehensive and accurate estimation of an individual's biological age, reflecting their overall health status and mortality risk.
                        </p>
                      </div>
                      <hr className="h-1 bg-green-600 border-0 rounded mt-2" />
                    </div>
                  </div>

                  {overallAgeItems.length > 0 ? (
                    overallAgeItems.map((item, index) => (
                      <EditableWrapper 
                        key={item.id} 
                        item={item} 
                        category="OverallAge"
                        isFirst={index === 0}
                        isLast={index === overallAgeItems.length - 1}
                      >
                        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg my-4 relative hover:border-green-500 transition-all">
                          <OverallAgeClientPage data={{ [item.title]: item }} />
                        </div>
                      </EditableWrapper>
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                      <p>No OverallAge items yet. Click "Add New" to create one.</p>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reference">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Reference Page</h2>
                 <EditableWrapper item={null} category="Reference">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Reference
                    </Button>
                 </EditableWrapper>
              </div>
              <div className="space-y-4">
                {referenceItems.length > 0 ? (
                    referenceItems.map((item, index) => (
                       <EditableWrapper 
                          key={item.id} 
                          item={item} 
                          category="Reference"
                          isFirst={index === 0}
                          isLast={index === referenceItems.length - 1}
                        >
                            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg my-4 relative hover:border-green-500 transition-all">
                                <ReferenceItemDisplay reference={item} />
                            </div>
                       </EditableWrapper>
                    ))
                  ) : (
                    <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                      <p>No Reference items yet. Click "Add New" to create one.</p>
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
