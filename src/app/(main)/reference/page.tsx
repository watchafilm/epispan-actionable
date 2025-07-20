import { fitnessAgeReferences } from '@/lib/references';
import { ReferenceItemDisplay } from '@/components/ReferenceItem';

export default function ReferencePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 font-headline text-primary">
        References
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary/30">
          Fitness Age
        </h2>
        <div className="space-y-4">
          {fitnessAgeReferences.map((ref, index) => (
            <ReferenceItemDisplay key={index} reference={ref} />
          ))}
        </div>
      </section>
    </div>
  );
}
