import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, runTransaction } from 'firebase/firestore';
import type { BaseItem, Item, FitnessAgeItem, EBPSInterventionItem, SymphonyAgeItem, ReferenceItem } from './definitions';
import { fitnessAgeReferences, overallOmicAgeReferences, symphonyAgeReferences } from './references';

// --- Mock Data ---
const MOCK_FITNESS_AGE_DATA: Omit<FitnessAgeItem, 'id' | 'category' | 'order'>[] = [
  {
      title: "Grip Strength",
      definition: "<p>The highest reading from either hand, measured in kilograms. It indicates overall body strength and has been linked to a person’s biological age acceleration, risk of all-cause mortality, and future functional decline.</p>",
      relatedDisease: "<ul><li>Frailty</li><li>Sarcopenia</li><li>Risk of falls</li><li>Overall mortality</li></ul>",
      diet: "<p><strong>Protein Intake:</strong> ≥1.0-1.2 g/kg body weight/day, with an emphasis on leucine-rich sources such as whey, dairy, and legumes to stimulate muscle protein synthesis.</p><p><strong>Vitamin D:</strong> Essential for muscle function and strength; supplementation may be necessary if sunlight exposure is limited.</p>",
      exercise: "<p><strong>Resistance Training:</strong> Progressive resistance exercises for the hand and forearm muscles, 2-3 times per week.</p><p><strong>Whole-Body Strength Training:</strong> Compound exercises like deadlifts and rows to improve overall strength.</p>",
      lifestyle: "<p><strong>Ergonomics:</strong> Proper ergonomic setup at workstations to prevent strain.</p><p><strong>Manual Activities:</strong> Engaging in hobbies that require hand strength, such as gardening or playing a musical instrument.</p>"
  },
  {
      title: "VO2MAX",
      definition: "<p>The maximum rate at which your heart, lungs, and muscles can effectively use oxygen during exercise. Higher VO₂max levels indicate greater cardiorespiratory fitness and endurance. It is a key indicator of cardiovascular health and is strongly linked to a reduced risk of various chronic diseases.</p>",
      relatedDisease: "<ul><li>Cardiovascular Disease</li><li>Hypertension</li><li>Type 2 Diabetes</li><li>Metabolic Syndrome</li></ul>",
      diet: "<p><strong>Nitrate-Rich Foods:</strong> Beets, spinach, and arugula can improve oxygen efficiency.</p><p><strong>Iron-Rich Foods:</strong> Lean meats, lentils, and fortified cereals to support oxygen transport in the blood.</p>",
      exercise: "<p><strong>High-Intensity Interval Training (HIIT):</strong> Alternating short bursts of intense exercise with recovery periods, proven to significantly increase VO₂ max.</p><p><strong>Endurance Training:</strong> Consistent aerobic activities like running, cycling, or swimming at a moderate intensity.</p>",
      lifestyle: "<p><strong>Altitude Training:</strong> Controlled exposure to high altitudes can stimulate red blood cell production.</p><p><strong>Hydration:</strong> Maintaining optimal fluid balance is crucial for performance.</p>"
  },
  {
      title: "Gait Speed",
      definition: "<p>The time it takes to walk a set distance at a normal pace, measured in meters per second. It reflects a combination of balance, strength, and coordination. Gait speed is considered a vital sign in older adults, as it can predict functional decline, disability, and mortality risk.</p>",
      relatedDisease: "<ul><li>Risk of Falls</li><li>Cognitive Decline</li><li>Frailty</li><li>Hospitalization Risk</li></ul>",
      diet: "<p><strong>Protein Intake:</strong> Adequate protein to maintain lower limb muscle mass.</p><p><strong>Vitamin D & Calcium:</strong> For bone health, which is foundational for mobility.</p>",
      exercise: "<p><strong>Strength Training:</strong> Focusing on leg muscles (quadriceps, hamstrings, calves).</p><p><strong>Balance and Coordination Exercises:</strong> Tai Chi, yoga, or specific balance drills.</p>",
      lifestyle: "<p><strong>Proper Footwear:</strong> Wearing supportive and well-fitting shoes.</p><p><strong>Safe Environment:</strong> Ensuring the living space is free of hazards that could cause falls.</p>"
  },
  {
      title: "FEV1",
      definition: "<p>Forced Expiratory Volume in 1 second, the maximum amount of air you can forcibly exhale in one second. It is a key measure of lung function and is often used to diagnose and monitor respiratory conditions. Lower FEV₁ values can indicate airway obstruction or reduced lung capacity.</p>",
      relatedDisease: "<ul><li>Chronic Obstructive Pulmonary Disease (COPD)</li><li>Asthma</li><li>Cardiovascular Mortality</li><li>Lung Cancer Risk</li></ul>",
      diet: "<p><strong>Antioxidant-Rich Foods:</strong> Fruits and vegetables rich in vitamins C and E can protect lung tissue from oxidative damage.</p><p><strong>Omega-3 Fatty Acids:</strong> Found in fish oil, may reduce inflammation in the airways.</p>",
      exercise: "<p><strong>Cardiovascular Exercise:</strong> Improves overall respiratory muscle endurance.</p><p><strong>Breathing Exercises:</strong> Techniques like diaphragmatic breathing and pursed-lip breathing can improve lung efficiency.</p>",
      lifestyle: "<p><strong>Smoking Cessation:</strong> The single most important factor to prevent FEV₁ decline.</p><p><strong>Avoidance of Pollutants:</strong> Minimizing exposure to air pollution, dust, and occupational hazards.</p>"
  }
];

const MOCK_EBPS_DATA: Omit<EBPSInterventionItem, 'id' | 'category' | 'order'>[] = [
    {
        title: "Glucose",
        description: '<p>The primary sugar present in your blood is glucose. It serves as the main energy source for your body. It originates in the food you consume. The majority of what you eat is converted by your body into glucose, which is then released into your bloodstream. Your pancreas releases insulin when your blood glucose levels rise.</p><p>It looks like DNAm fasting glucose does change depending on your fed and fasted states.</p>',
        howShouldWeDo: '<p>Decrease</p>',
        biomarkersCategory: '<p>Clinical outcomes</p>',
        diet: '<ul><li><strong>Balanced Diet Adoption:</strong> Carbohydrate Management: Prioritize the intake of complex carbohydrates with a low glycemic index (GI) to control blood sugar levels effectively.</li><li><strong>Portion Control:</strong> Be vigilant about portion sizes to prevent overeating, which can lead to elevated blood sugar.</li><li><strong>Balanced Meals:</strong> Ensure meals include a combination of lean proteins, healthy fats, and fiber-rich foods to stabilize blood sugar levels.</li></ul>',
        recommendations: "<p><strong>Diabetes Mellitus</strong>: Type 1 Diabetes: An autoimmune condition where the immune system attacks and destroys insulin-producing beta cells in the pancreas, leading to insufficient insulin production.<br><br>Type 2 Diabetes: Characterized by insulin resistance, where cells do not respond effectively to insulin, and insufficient insulin production over time. It is often linked to lifestyle factors such as obesity and physical inactivity.</p><p><strong>Impaired Fasting Glucose (IFG) and Impaired Glucose Tolerance (IGT)</strong>: Conditions where blood glucose levels are higher than normal but not high enough for a diabetes diagnosis. These conditions increase the risk of developing type 2 diabetes.</p>"
    }
];

const MOCK_SYMPHONY_DATA: Omit<SymphonyAgeItem, 'id' | 'category' | 'order'>[] = [
    {
        title: 'Musculoskeletal',
        diet: '<ul><li>Vitamin D: Pan-sear salmon (15 mcg/100g) with soy-ginger glaze.</li><li>Collagen peptides: Simmer bone broth with ginger for soups.</li></ul>',
        exercise: '<ul><li>Resistance training.</li><li>General adults: Squats, lunges, and dumbbell rows 2-3 times/week.</li><li>Older adults: Chair squats and resistance band exercises to maintain strength safely.</li></ul>',
        lifestyle: '<p>Stress reduction: Chronic stress elevates inflammatory cytokines (IL-6), accelerating bone resorption (Rondanelli et al., 2021). Mindfulness or Tai Chi can help.</p>'
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
        
        MOCK_FITNESS_AGE_DATA.forEach((item, index) => {
            const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'FitnessAge', order: index });
        });
        
        MOCK_EBPS_DATA.forEach((item, index) => {
            const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'EBPS Intervention', order: index });
        });

        MOCK_SYMPHONY_DATA.forEach((item, index) => {
             const docRef = doc(itemsCollection);
            batch.set(docRef, { ...item, category: 'Symphony', order: index });
        });

        [...fitnessAgeReferences, ...overallOmicAgeReferences, ...symphonyAgeReferences].forEach((item, index) => {
            const docRef = doc(itemsCollection);
            batch.set(docRef, { 
                ...item, 
                category: 'Reference', 
                order: index, 
                title: item.text.substring(0, 50) + '...'
            });
        });
        
        await batch.commit();
        console.log("Seeding complete.");
    } else {
        // Migration: Check if existing documents have the 'order' field
        let needsMigration = false;
        for (const doc of snapshot.docs) {
            if (doc.data().order === undefined) {
                needsMigration = true;
                break;
            }
        }

        if (needsMigration) {
            console.log("Documents are missing 'order' field. Starting migration...");
            const allItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            
            const categories = [...new Set(allItems.map(item => item.category))];
            
            const batch = writeBatch(db);
            for (const category of categories) {
                const categoryItems = allItems.filter(item => item.category === category);
                // Simple ordering by title for migration
                categoryItems.sort((a, b) => a.title.localeCompare(b.title));
                categoryItems.forEach((item, index) => {
                    const docRef = doc(db, 'items', item.id);
                    batch.update(docRef, { order: index });
                });
            }
            await batch.commit();
            console.log("Order field migration complete.");
        } else {
            console.log("Collection is not empty and seems up to date, skipping seed.");
        }
    }
}

// Call seedData on startup. In a real app, you might run this as a separate script.
seedData().catch(console.error);


export async function getItems(category: Item['category']): Promise<Item[]> {
  // Fetch all items and filter/sort in code to avoid composite indexes
  const snapshot = await getDocs(itemsCollection);
  const allItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
  
  const filteredItems = allItems.filter(item => item.category === category);
  filteredItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
  return filteredItems;
}

export async function getAllItems(): Promise<BaseItem[]> {
  // Fetch all items and sort in code to avoid composite indexes
  const snapshot = await getDocs(itemsCollection);
  const allItems = snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    category: doc.data().category,
    order: doc.data().order,
  }));

  allItems.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });
  
  return allItems;
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


export async function addItem(itemData: Omit<Item, 'id' | 'order'> & {order?: number}) {
    const items = await getItems(itemData.category);
    const maxOrder = items.reduce((max, item) => Math.max(max, item.order ?? -1), -1);
    
    const newItem = {
        ...itemData,
        order: maxOrder + 1,
    };

    const docRef = await addDoc(itemsCollection, newItem);
    return { id: docRef.id, ...newItem };
}

export async function updateItem(id: string, updates: Partial<Omit<Item, 'id'>>) {
    const docRef = doc(db, 'items', id);
    await updateDoc(docRef, updates);
    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function updateItemsOrder(items: {id: string, order: number}[]) {
  try {
    await runTransaction(db, async (transaction) => {
      for (const item of items) {
        const itemRef = doc(db, 'items', item.id);
        transaction.update(itemRef, { order: item.order });
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating items order: ", error);
    return { success: false, message: "Failed to update order." };
  }
}

export async function deleteItem(id: string) {
    const docRef = doc(db, 'items', id);
    await deleteDoc(docRef);
    return { success: true };
}
