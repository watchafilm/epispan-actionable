import { getItems } from '@/lib/data';
import type { ReferenceItem } from '@/lib/definitions';
import { ReferenceItemDisplay } from '@/components/ReferenceItem';

export const dynamic = 'force-dynamic';

export default async function ReferencePage() {
  const allReferences = (await getItems('Reference')) as ReferenceItem[];

  const fitnessAgeReferences = allReferences.filter(
    (ref) => ref.subCategory === 'Fitness Age'
  );
  const overallOmicAgeReferences = allReferences.filter(
    (ref) => ref.subCategory === 'OVERALL OmicAge'
  );
  const symphonyAgeReferences = allReferences.filter(
    (ref) => ref.subCategory === 'SymphonyAge'
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 font-headline text-primary">
        References
      </h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
            Fitness Age
          </h2>
          <div className="space-y-4">
            {fitnessAgeReferences.map((ref) => (
              <ReferenceItemDisplay key={ref.id} reference={ref} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
            OVERALL OmicAge
          </h2>
          <div className="space-y-4">
            {overallOmicAgeReferences.map((ref) => (
              <ReferenceItemDisplay key={ref.id} reference={ref} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
            SymphonyAge
          </h2>
          <div className="space-y-4">
            {symphonyAgeReferences.map((ref) => (
              <ReferenceItemDisplay key={ref.id} reference={ref} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
