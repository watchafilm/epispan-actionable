import { getItems } from '@/lib/data';
import { FitnessAgeClientPage } from './client-page';
import type { Item } from '@/lib/definitions';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const MOCK_DATA = {
  "Gait Speed": {
    definition: "Speed of walking over a short distance; reflects lower body strength, coordination, and neurological function.",
    relatedDisease: "Mobility, risk of disability, neurological health, balance.",
    diet: "Protein: 20-40 g high-quality protein (e.g., whey) after resistance training session, daily; leucine-rich sources preferred.\n\nVitamin D:\nboth of male and female\n19-70 years : 15 µg/day\n>70 years : 20 µg/day\n\nOmega-3 fatty acid: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.",
    exercise: "Resistance training for lower limbs: Walking\n\nGait and balance training\n\nProgressive aerobic walking",
    lifestyle: "Daily movement, Avoid prolonged secentary behavior, Cognitive and social engagement."
  },
  "VO2MAX": {
    definition: "Maximum oxygen uptake; reflects cardiovascular and respiratory efficiency during exercise.",
    relatedDisease: "Cardiovascular fitness, endurance, longevity, risk of heart disease.",
    diet: "Dietary nitrate: 5-16.8 mmol (~300-1041 mg) nitrate, taken 2-3 hours before exercise; can be achieved with ~250-500 g of leafy/root vegetables or as a supplement. Avoid mouthwash before use.\n\nIron: Dose varies by deficiency status; in studies, 100 mg elemental iron daily for 6-8 weeks in iron-deficient, non-anemic women improved endurance performance (not VO2Max in all cases).\nDietary References Intakes (DRIs):\nMales > 19-70 Ys: 8 mg/d\nFemales > 19-50 Ys: 18 mg/d\n> 50-70 Ys: 8 mg/d\n\nAntioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.",
    exercise: "High-intensity interval (HIIT): Intervals at 85-95% HRmax, e.g., 4x4 min with 3 min recovery, 2-3 times/week for ≥6 weeks.\n\nModerate continuous endurance training, Tailored training: Aerobic cardio (running, cycling, swimming).",
    lifestyle: "Adequate sleep (7-9 hours), Stress management, Training monitoring and adjustment."
  },
  "Grip Strength": {
    definition: "Measures hand and forearm strength; correlated with overall muscle strength and functional status.",
    relatedDisease: "Frailty, sarcopenia, risk of falls, overall mortality.",
    diet: "Adequate protein intake: ≥1.0-1.2 g/kg body weight/day, ≥20 g high-quality protein per meal, including leucine-rich sources such as eggs, seeds, oats, and legumes.\n\nVitamin D: both of male and female\n19-70 years: 15 µg/day\n>70 years: 20 µg/day\n\nAntioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.",
    exercise: "Progressive Resistance training for hand/forearm: 2-3 sessions/week, focusing on major lower limb muscles (e.g., squats, leg press), moderate-to-high intensity, 8-12 reps/set, 2-3 sets.\n\nFunctional gripping exercises, Regular physical activity: Incorporate into daily tasks (carrying groceries, opening jars) and structured exercise.",
    lifestyle: "Smoking cessation, Limit alcohol intake, Maintain healthy weight and manage chronic disease."
  },
  "FEV1": {
    definition: "Forced Expiratory Volume in 1 second; indicates lung function and respiratory health.",
    relatedDisease: "Asthma, COPD, lung health, respiratory aging, early mortality risk.",
    diet: "Omega-3: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.\n\nAntioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.\n\nAdequate hydration: ~2-3 L water/day, adjust for climate and activity.",
    exercise: "Respiratory muscle training: Breathing exercises\n\nModerate-intensity aerobic exercise\n\nYoga with pranayama.",
    lifestyle: "Smoking cessation, Avoid air pollution, Manage chronic respiratory diseases."
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
  }, {} as Record<string, Item & {definition: string; relatedDisease: string; diet: string; exercise: string; lifestyle: string;}>);


  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-start gap-x-6 mb-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary tracking-wider">FITNESS AGE</h1>
           <p className="text-muted-foreground text-sm max-w-4xl">
            Incorporating physical fitness measurements into epigenetic clocks enhances the detection of lifestyle, medical, and environmental impacts on aging. The DNAmFitAgeAccel algorithm, developed by UCLA researchers, estimates epigenetic age acceleration based on fitness. A modified version, called OMICm FitAge, integrates the OMICm Age algorithm (developed with Harvard) to estimate biological age based on physical fitness and functionality.
          </p>
        </div>
        <div className="flex-shrink-0">
            <Image
                src="https://www.genfosis.com/images/Genfosis_Logo_PNG.webp"
                alt="Genfosis Logo"
                width={120}
                height={32}
                priority
            />
        </div>
      </div>
      
      <hr className="h-1 bg-primary border-0 rounded my-4" />

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
