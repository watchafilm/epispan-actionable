import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import type { BaseItem, Item, FitnessAgeItem, EBPSInterventionItem, SymphonyItem, ReferenceItem } from './definitions';

// --- Mock Data ---
const MOCK_FITNESS_AGE_DATA: Omit<FitnessAgeItem, 'id' | 'category'>[] = [
  {
    title: "Gait Speed",
    definition: "Speed of walking over a short distance; reflects lower body strength, coordination, and neurological function.",
    relatedDisease: "Mobility, risk of disability, neurological health, balance.",
    diet: "Protein: 20-40 g high-quality protein (e.g., whey) after resistance training session, daily; leucine-rich sources preferred.\n\nVitamin D:\nboth of male and female\n19-70 years : 15 µg/day\n>70 years : 20 µg/day\n\nOmega-3 fatty acid: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.",
    exercise: "Resistance training for lower limbs: Walking\n\nGait and balance training\n\nProgressive aerobic walking",
    lifestyle: "Daily movement, Avoid prolonged secentary behavior, Cognitive and social engagement."
  },
  {
    title: "VO2MAX",
    definition: "Maximum oxygen uptake; reflects cardiovascular and respiratory efficiency during exercise.",
    relatedDisease: "Cardiovascular fitness, endurance, longevity, risk of heart disease.",
    diet: "Dietary nitrate: 5-16.8 mmol (~300-1041 mg) nitrate, taken 2-3 hours before exercise; can be achieved with ~250-500 g of leafy/root vegetables or as a supplement. Avoid mouthwash before use.\n\nIron: Dose varies by deficiency status; in studies, 100 mg elemental iron daily for 6-8 weeks in iron-deficient, non-anemic women improved endurance performance (not VO2Max in all cases).\nDietary References Intakes (DRIs):\nMales > 19-70 Ys: 8 mg/d\nFemales > 19-50 Ys: 18 mg/d\n> 50-70 Ys: 8 mg/d\n\nAntioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.",
    exercise: "High-intensity interval (HIIT): Intervals at 85-95% HRmax, e.g., 4x4 min with 3 min recovery, 2-3 times/week for ≥6 weeks.\n\nModerate continuous endurance training, Tailored training: Aerobic cardio (running, cycling, swimming).",
    lifestyle: "Adequate sleep (7-9 hours), Stress management, Training monitoring and adjustment."
  },
  {
    title: "Grip Strength",
    definition: "Measures hand and forearm strength; correlated with overall muscle strength and functional status.",
    relatedDisease: "Frailty, sarcopenia, risk of falls, overall mortality.",
    diet: "Adequate protein intake: ≥1.0-1.2 g/kg body weight/day, ≥20 g high-quality protein per meal, including leucine-rich sources such as eggs, seeds, oats, and legumes.\n\nVitamin D: both of male and female\n19-70 years: 15 µg/day\n>70 years: 20 µg/day\n\nAntioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.",
    exercise: "Progressive Resistance training for hand/forearm: 2-3 sessions/week, focusing on major lower limb muscles (e.g., squats, leg press), moderate-to-high intensity, 8-12 reps/set, 2-3 sets.\n\nFunctional gripping exercises, Regular physical activity: Incorporate into daily tasks (carrying groceries, opening jars) and structured exercise.",
    lifestyle: "Smoking cessation, Limit alcohol intake, Maintain healthy weight and manage chronic disease."
  },
  {
    title: "FEV1",
    definition: "Forced Expiratory Volume in 1 second; indicates lung function and respiratory health.",
    relatedDisease: "Asthma, COPD, lung health, respiratory aging, early mortality risk.",
    diet: "Omega-3: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.\n\nAntioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.\n\nAdequate hydration: ~2-3 L water/day, adjust for climate and activity.",
    exercise: "Respiratory muscle training: Breathing exercises\n\nModerate-intensity aerobic exercise\n\nYoga with pranayama.",
    lifestyle: "Smoking cessation, Avoid air pollution, Manage chronic respiratory diseases."
  }
];

const MOCK_EBPS_DATA: Omit<EBPSInterventionItem, 'id' | 'category'>[] = [
    {
        title: "Glucose",
        description: 'The primary sugar present in your blood is glucose. It serves as the main energy source for your body. It originates in the food you consume. The majority of what you eat is converted by your body into glucose, which is then released into your bloodstream. Your pancreas releases insulin when your blood glucose levels rise.\n\nIt looks like DNAm fasting glucose does change depending on your fed and fasted states.',
        howShouldWeDo: 'Decrease',
        clinicalOutcomes: 'Clinical outcomes',
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
];

const MOCK_SYMPHONY_DATA: Omit<SymphonyItem, 'id' | 'category'>[] = [
    {
        title: 'Symphony Score',
        value: '8.2 / 10',
        description: 'A holistic measure of your well-being, combining physical, mental, and social health metrics.',
        buttonText: 'View Breakdown',
        buttonLink: '#',
    }
];

const MOCK_REFERENCE_DATA: Omit<ReferenceItem, 'id' | 'category'>[] = [
    {
        title: 'Optimal Range',
        value: '45-50 years',
        description: 'The optimal FitnessAge range for your demographic group for longevity and healthspan.',
        buttonText: 'See References',
        buttonLink: '#',
    }
];


// --- Firestore Functions ---

const itemsCollection = collection(db, 'items');

// Helper to seed data if collection is empty
async function seedData() {
    const snapshot = await getDocs(itemsCollection);
    if (snapshot.empty) {
        console.log("Empty collection, seeding mock data...");
        const batch = writeBatch(db);
        
        MOCK_FITNESS_AGE_DATA.forEach(item => {
            const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'FitnessAge' });
        });
        
        MOCK_EBPS_DATA.forEach(item => {
            const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'EBPS Intervention' });
        });

        MOCK_SYMPHONY_DATA.forEach(item => {
             const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'Symphony' });
        });

        MOCK_REFERENCE_DATA.forEach(item => {
            const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'Reference' });
        });
        
        await batch.commit();
        console.log("Seeding complete.");
    } else {
        console.log("Collection is not empty, skipping seed.");
    }
}

// Call seedData on startup. In a real app, you might run this as a separate script.
seedData().catch(console.error);


export async function getItems(category: Item['category']): Promise<Item[]> {
  const q = query(itemsCollection, where("category", "==", category));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
}

export async function getAllItems(): Promise<BaseItem[]> {
  const snapshot = await getDocs(itemsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    category: doc.data().category,
    value: doc.data().value || '', // Add value for display
  }));
}

export async function getItemById(id: string): Promise<Item | null> {
    const docRef = doc(db, 'items', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Item;
    } else {
        return null;
    }
}


export async function addItem(itemData: Omit<Item, 'id'>) {
    const docRef = await addDoc(itemsCollection, itemData);
    return { id: docRef.id, ...itemData };
}

export async function updateItem(id: string, updates: Partial<Omit<Item, 'id'>>) {
    const docRef = doc(db, 'items', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deleteItem(id: string) {
    const docRef = doc(db, 'items', id);
    await deleteDoc(docRef);
    return { success: true };
}
