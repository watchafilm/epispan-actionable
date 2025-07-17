import { getItems } from '@/lib/data';
import { FitnessAgeClientPage } from './client-page';
import { HeartPulse, Utensils, Dumbbell, PersonStanding } from 'lucide-react';
import type { Item } from '@/lib/definitions';

export const dynamic = 'force-dynamic';

const MOCK_DATA = {
  "Gait Speed": {
    definition: "Speed of walking over a short distance; reflects lower body strength, coordination, and neurological function.",
    relatedDisease: "Mobility, risk of disability, neurological health, balance.",
    diet: "Protein: 20-40 g high-quality protein (e.g., whey) after resistance training session, daily; leucine-rich sources preferred.\n\nVitamin D:\nboth of male and female\n19-70 years : 15 µg/day\n>70 years : 20 µg/day\n\nOmega-3 fatty acid: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.",
    exercise: "Resistance training for lower limbs: Walking\n\nGait and balance training\n\nProgressive aerobic walking",
    lifestyle: "Daily movement, Avoid prolonged secentary behavior, Cognitive and social engagement."
  }
};


export default async function FitnessAgePage() {
  const items = await getItems('FitnessAge');

  // Let's create a more structured data object
  const fitnessData = items.reduce((acc, item) => {
    // A simple mock for extra data. In a real scenario, this would come from a database.
    const extraData = MOCK_DATA[item.title as keyof typeof MOCK_DATA] || {
        definition: item.description,
        relatedDisease: "Not specified",
        diet: "No specific diet recommendations.",
        exercise: "No specific exercise recommendations.",
        lifestyle: "No specific lifestyle recommendations."
    };

    acc[item.title] = {
      ...item,
      ...extraData,
    };
    return acc;
  }, {} as Record<string, Item & typeof MOCK_DATA["Gait Speed"]>);


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-2">
         <div className="flex-shrink-0">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.3332 12.0332C25.8207 11.514 26.1553 10.8653 26.3053 10.1556C26.4553 9.44588 26.4151 8.70617 26.1887 8.01635C25.9623 7.32653 25.558 6.71188 25.0165 6.23396C24.475 5.75604 23.8163 5.43262 23.1023 5.29825C22.3883 5.16388 21.6521 5.22383 20.9622 5.47352C20.2723 5.72321 19.6433 6.15413 19.1673 6.72149C18.6912 7.28885 18.3841 7.97157 18.2817 8.7032C18.1794 9.43482 18.2858 10.1915 18.5907 10.8799L14.6665 14.8041C14.179 14.2849 13.8444 13.6361 13.6944 12.9264C13.5444 12.2167 13.5846 11.477 13.811 10.7872C14.0374 10.0974 14.4417 9.4827 14.9832 9.00478C15.5247 8.52686 16.1834 8.20344 16.8974 8.06907C17.6114 7.9347 18.3476 7.99465 19.0375 8.24434C19.7274 8.49403 20.3564 8.92495 20.8324 9.49231C21.3085 10.0597 21.6156 10.7424 21.7179 11.474C21.8202 12.2056 21.7138 12.9624 21.4089 13.6508L25.3332 17.5749C25.8207 17.0557 26.1553 16.407 26.3053 15.6973C26.4553 14.9876 26.4151 14.2479 26.1887 13.558C25.9623 12.8682 25.558 12.2536 25.0165 11.7757C24.475 11.2977 23.8163 10.9743 23.1023 10.84C22.3883 10.7056 21.6521 10.7656 20.9622 11.0153C20.2723 11.265 19.6433 11.6959 19.1673 12.2633C18.6912 12.8306 18.3841 13.5133 18.2817 14.245C18.1794 14.9766 18.2858 15.7333 18.5907 16.4217L14.6665 20.3459C14.179 19.8267 13.8444 19.1779 13.6944 18.4682C13.5444 17.7585 13.5846 17.0188 13.811 16.329C14.0374 15.6392 14.4417 15.0245 14.9832 14.5466C15.5247 14.0687 16.1834 13.7452 16.8974 13.6109C17.6114 13.4765 18.3476 13.5365 19.0375 13.7861C19.7274 14.0358 20.3564 14.4668 20.8324 15.0341C21.3085 15.6015 21.6156 16.2842 21.7179 17.0158C21.8202 17.7474 21.7138 18.5042 21.4089 19.1926L18.5907 22.0108C18.2858 21.3224 18.1794 20.5656 18.2817 19.834C18.3841 19.1024 18.6912 18.4197 19.1673 17.8523C19.6433 17.2849 20.2723 16.854 20.9622 16.6043C21.6521 16.3546 22.3883 16.2947 23.1023 16.429C23.8163 16.5634 24.475 16.8868 25.0165 17.3647C25.558 17.8427 25.9623 18.4573 26.1887 19.1471C26.4151 19.837 26.4553 20.5767 26.3053 21.2864C26.1553 21.9961 25.8207 22.6448 25.3332 23.164L21.4089 27.0882C21.7138 27.7766 21.8202 28.5334 21.7179 29.265C21.6156 29.9966 21.3085 30.6793 20.8324 31.2467C20.3564 31.8141 19.7274 32.245 19.0375 32.4947C18.3476 32.7444 17.6114 32.8043 16.8974 32.67C16.1834 32.5357 15.5247 32.2122 14.9832 31.7343C14.4417 31.2564 14.0374 30.6417 13.811 29.9519C13.5846 29.2621 13.5444 28.5224 13.6944 27.8127C13.8444 27.103 14.179 26.4542 14.6665 25.935L18.5907 22.0108" stroke="#AE955A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">FITNESS AGE</h1>
        </div>
      </div>
      <p className="text-muted-foreground mb-6">
        Incorporating physical fitness measurements into epigenetic clocks enhances the detection of lifestyle, medical, and environmental impacts on aging. The DNAmFitAgeAccel algorithm, developed by UCLA researchers, estimates epigenetic age acceleration based on fitness. A modified version, called OMICm FitAge, integrates the OMICm Age algorithm (developed with Harvard) to estimate biological age based on physical fitness and functionality.
      </p>

      {Object.keys(fitnessData).length > 0 ? (
        <FitnessAgeClientPage data={fitnessData} />
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold">No data available</h2>
          <p>Please check back later or add data in the admin panel.</p>
        </div>
      )}
    </div>
  );
}
