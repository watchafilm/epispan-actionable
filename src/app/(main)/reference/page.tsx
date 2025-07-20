import {
  fitnessAgeReferences,
  overallOmicAgeReferences,
  symphonyAgeReferences,
} from '@/lib/references';
import { ReferenceItemDisplay } from '@/components/ReferenceItem';

export default function ReferencePage() {
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
            {fitnessAgeReferences.map((ref, index) => (
              <ReferenceItemDisplay key={`fitness-${index}`} reference={ref} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
            OVERALL OmicAge
          </h2>
          <div className="space-y-4">
            {overallOmicAgeReferences.map((ref, index) => (
              <ReferenceItemDisplay key={`omic-${index}`} reference={ref} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
            SymphonyAge
          </h2>
          <div className="space-y-4">
            {symphonyAgeReferences.map((ref, index) => (
              <ReferenceItemDisplay key={`symphony-${index}`} reference={ref} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
