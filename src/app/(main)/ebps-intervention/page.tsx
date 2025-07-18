import { EBPSInterventionClientPage } from './client-page';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const MOCK_DATA = {
  Glucose: {
    description: 'The primary sugar present in your blood is glucose. It serves as the main energy source for your body. It originates in the food you consume. The majority of what you eat is converted by your body into glucose, which is then released into your bloodstream. Your pancreas releases insulin when your blood glucose levels rise.\n\nIt looks like DNAm fasting glucose does change depending on your fed and fasted states.',
    howShouldWeDo: 'Decrease',
    clinicalOutcomes: 'Glucose',
    diet: {
      'Diabetes Mellitus': 'Type 1 Diabetes: An autoimmune condition where the immune system attacks and destroys insulin-producing beta cells in the pancreas, leading to insufficient insulin production.\n\nType 2 Diabetes: Characterized by insulin resistance, where cells do not respond effectively to insulin, and insufficient insulin production over time. It is often linked to lifestyle factors such as obesity and physical inactivity.',
      'Impaired Fasting Glucose (IFG) and Impaired Glucose Tolerance (IGT)': 'Conditions where blood glucose levels are higher than normal but not high enough for a diabetes diagnosis. These conditions increase the risk of developing type 2 diabetes.',
      'Metabolic Syndrome': 'A cluster of conditions, including abdominal obesity, elevated blood pressure, high triglycerides, low HDL cholesterol, and insulin resistance. It increases the risk of type 2 diabetes and cardiovascular disease.',
      "Cushing's Syndrome": 'A hormonal disorder characterized by prolonged exposure to high levels of cortisol, which can lead to insulin resistance and elevated blood glucose levels.',
      'Polycystic Ovary Syndrome (PCOS)': 'A common endocrine disorder among women of reproductive age, often associated with insulin resistance and an increased risk of developing type 2 diabetes.',
      'Certain Hormonal Disorders': 'Disorders affecting hormones such as growth hormone, glucagon, and cortisol can impact blood glucose regulation.',
      'Pancreatic Disorders': 'Diseases affecting the pancreas, such as pancreatitis or pancreatic cancer, can disrupt insulin production and glucose regulation.'
    },
    recommendations: {
      'Reducing Glucose and Improving Insulin Resistance': [
        'Balanced Diet Adoption: Carbohydrate Management: Prioritize the intake of complex carbohydrates with a low glycemic index (GI) to control blood sugar levels effectively.',
        'Portion Control: Be vigilant about portion sizes to prevent overeating, which can lead to elevated blood sugar.',
        'Balanced Meals: Ensure meals include a combination of lean proteins, healthy fats, and fiber-rich foods to stabilize blood sugar levels.'
      ],
      'Regular Physical Activity Commitment': 'Regular exercise, as recommended by a healthcare provider, is crucial. It enhances insulin sensitivity, allowing more efficient use of insulin in blood sugar regulation.',
      'Weight Management': 'Work towards achieving and maintaining a healthy weight. Modest weight reduction can significantly improve insulin sensitivity and glycemic control.',
      'Reduction of Sugary Foods and Beverages': 'Minimize intake of high-sugar foods and drinks to avoid rapid spikes in blood sugar levels.',
      'Smoking Cessation': 'If smoking, quitting is essential, as smoking contributes to insulin resistance and complicates diabetes management.',
      'Stress Management Techniques': 'Employ stress-reduction practices like mindfulness, meditation, or yoga. Chronic stress can lead to higher blood sugar levels.',
      'Supplements and Medication Consideration': 'Explore diabetic medications like GLP-1s, SGLT2 inhibitors, and metformin. Supplements such as berberine and dihydroberberine can also be beneficial in improving HbA1c levels.'
    }
  }
};

export default async function EBPSInterventionPage() {
  // In a real app, you might fetch this data from a CMS or database
  const pageData = MOCK_DATA;

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
