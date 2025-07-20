import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import type { BaseItem, Item, FitnessAgeItem, EBPSInterventionItem, SymphonyAgeItem, ReferenceItem } from './definitions';

// --- Mock Data ---
const MOCK_FITNESS_AGE_DATA: Omit<FitnessAgeItem, 'id' | 'category'>[] = [
    {
      title: "Grip Strength",
      definition: "<p>The highest reading from either hand, measured in kilograms. It indicates overall body strength and has been linked to a person’s biological age acceleration, risk of all-cause mortality, and future functional decline.</p>",
      relatedDisease: "<p>Frailty, sarcopenia, risk of falls, overall mortality.</p>",
      diet: "<ul><li>Adequate protein intake: ≥1.0-1.2 g/kg body weight/day</li><li>≥20 g high-quality protein per meal, including leucine-rich sources such as eggs, seeds, oats, and legumes.</li><li>Vitamin D: both of male and female<br>19-70 years: 15 µg/day<br>>70 years: 20 µg/day</li><li>Antioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.</li></ul>",
      exercise: "<ul><li>Progressive Resistance training for hand/forearm: 2-3 sessions/week, focusing on major lower limb muscles (e.g., squats, leg press), moderate-to-high intensity, 8-12 reps/set, 2-3 sets.</li><li>Functional gripping excercises, Regular physical activity: Incorporate into daily tasks (carrying groceries, opening jars) and structured exercise.</li></ul>",
      lifestyle: "<p>Smoking cessation, Limit alcohol intake, Maintain healthy weight and manage chronic disease.</p>"
    },
    {
      title: "VO2MAX",
      definition: "<p>The maximum rate at which your heart, lungs, and muscles can effectively use oxygen during exercise. Higher VO₂max levels indicate greater cardiorespiratory fitness and endurance. It is a key indicator of cardiovascular health and is strongly linked to a reduced risk of various chronic diseases.</p>",
      relatedDisease: "<p>Cardiovascular fitness, endurance, longevity, risk of heart disease.</p>",
      diet: "<ul><li>Dietary nitrate: 5-16.8 mmol (~300-1041 mg) nitrate, taken 2-3 hours before exercise; can be achieved with ~250-500 g of leafy/root vegetables or as a supplement. Avoid mouthwash before use.</li><li>Iron: Dose varies by deficiency status; in studies, 100 mg elemental iron daily for 6-8 weeks in iron-deficient, non-anemic women improved endurance performance (not VO2Max in all cases). Dietary References intakes (DRIs): Males > 19-70 Ys: 8 mg/d, Femakes > 19-50 Ys: 18 mg/d, > 50-70 Ys: 8 mg/d</li><li>Antioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.</li></ul>",
      exercise: "<ul><li>High-intensity interval (HIIT): Intervals at 85-95% HRmax, e.g., 4x4 min with 3 min recovery, 2-3 times/week for ≥6 weeks.</li><li>Moderate continuous endurance training.</li><li>Tailored training: Aerobic cardio (running, cycling, swimming).</li></ul>",
lifestyle: "<p>Adequate sleep (7-9 hours), Stress management, Training monitoring and adjustment.</p>"
    },
    {
        title: "Gait Speed",
        definition: "<p>The time it takes to walk a set distance at a normal pace, measured in meters per second. It reflects a combination of balance, strength, and coordination. Gait speed is considered a vital sign in older adults, as it can predict functional decline, disability, and mortality risk.</p>",
        relatedDisease: "<p>Mobility, risk of disability, neurological health, balance.</p>",
        diet: "<ul><li>Protein: 20-40 g high-quality protein (e.g., whey) after resistance training session, daily; leucine-rich sources preferred.</li><li>Vitamin D: both of male and female<br>19-70 years: 15 µg/day<br>>70 years: 20 µg/day</li><li>Omega-3 fatty acid: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.</li></ul>",
        exercise: "<ul><li>Resistance training for lower limbs: Walking</li><li>Gait and balance training</li><li>Progressive aerobic walking</li></ul>",
        lifestyle: "<p>Daily movement, Avoid prolonged secentary behavior, Cognitive and social engagement.</p>"
    },
    {
        title: "FEV1",
        definition: "<p>Forced Expiratory Volume in 1 second, the maximum amount of air you can forcibly exhale in one second. It is a key measure of lung function and is often used to diagnose and monitor respiratory conditions. Lower FEV₁ values can indicate airway obstruction or reduced lung capacity.</p>",
        relatedDisease: "<p>Asthma, COPD, lung health, respiratory aging, early mortality risk.</p>",
        diet: "<ul><li>Omega-3: 1-3 g/day EPA+DHA; upper safe limit is 3 g/day.</li><li>Antioxidants: Vitamin C 500-1000 mg/day, Vitamin E 15 mg/day.</li><li>Adequate hydration: ~2-3 L water/day, adjust for climate and activity.</li></ul>",
        exercise: "<ul><li>Respiratory muscle training: Breathing exercises</li><li>Moderate-intensity aerobic exercise</li><li>Yoga with pranayama.</li></ul>",
        lifestyle: "<p>Smoking cessation, Avoid air pollution, Manage chronic respiratory diseases.</p>"
    }
];

const MOCK_EBPS_DATA: Omit<EBPSInterventionItem, 'id' | 'category'>[] = [
    {
        title: "Glucose",
        description: '<p>The primary sugar present in your blood is glucose. It serves as the main energy source for your body. It originates in the food you consume. The majority of what you eat is converted by your body into glucose, which is then released into your bloodstream. Your pancreas releases insulin when your blood glucose levels rise.</p><p>It looks like DNAm fasting glucose does change depending on your fed and fasted states.</p>',
        howShouldWeDo: '<p>Decrease</p>',
        biomarkersCategory: '<p>Clinical outcomes</p>',
        diet: "<p><strong>Diabetes Mellitus</strong>: Type 1 Diabetes: An autoimmune condition where the immune system attacks and destroys insulin-producing beta cells in the pancreas, leading to insufficient insulin production.<br><br>Type 2 Diabetes: Characterized by insulin resistance, where cells do not respond effectively to insulin, and insufficient insulin production over time. It is often linked to lifestyle factors such as obesity and physical inactivity.</p><p><strong>Impaired Fasting Glucose (IFG) and Impaired Glucose Tolerance (IGT)</strong>: Conditions where blood glucose levels are higher than normal but not high enough for a diabetes diagnosis. These conditions increase the risk of developing type 2 diabetes.</p>",
        recommendations: "<ul><li><strong>Balanced Diet Adoption:</strong> Carbohydrate Management: Prioritize the intake of complex carbohydrates with a low glycemic index (GI) to control blood sugar levels effectively.</li><li><strong>Portion Control:</strong> Be vigilant about portion sizes to prevent overeating, which can lead to elevated blood sugar.</li><li><strong>Balanced Meals:</strong> Ensure meals include a combination of lean proteins, healthy fats, and fiber-rich foods to stabilize blood sugar levels.</li></ul>"
    }
];

const MOCK_SYMPHONY_DATA: Omit<SymphonyAgeItem, 'id' | 'category'>[] = [
    {
        title: 'Musculoskeletal',
        definition: '<p>The musculoskeletal system provides form, support, stability, and movement to the body. It is made up of the bones of the skeleton, muscles, cartilage, tendons, ligaments, joints, and other connective tissue that supports and binds tissues and organs together.</p>',
        relatedDisease: '<p>Osteoporosis, Sarcopenia, Arthritis</p>',
        diet: '<ul><li>Vitamin D: Pan-sear salmon (15 mcg/100g) with soy-ginger glaze.</li><li>Collagen peptides: Simmer bone broth with ginger for soups.</li></ul>',
        exercise: '<ul><li>Resistance training.</li><li>General adults: Squats, lunges, and dumbbell rows 2-3 times/week.</li><li>Older adults: Chair squats and resistance band exercises to maintain strength safely.</li></ul>',
        lifestyle: '<p>Stress reduction: Chronic stress elevates inflammatory cytokines (IL-6), accelerating bone resorption (Rondanelli et al., 2021). Mindfulness or Tai Chi can help.</p>'
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
