'use server';

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, runTransaction, query, where, orderBy } from 'firebase/firestore';
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
        definition: '<p>The organ system age score is based on the evaluation of key biomarkers that reflect the health and function of the musculoskeletal system, which includes bones, muscles, and connective tissues.</p>',
        diet: '<ul><li>Vitamin D: Pan-sear salmon (15 mcg/100g) with soy-ginger glaze.</li><li>Collagen peptides: Simmer bone broth with ginger for soups.</li></ul>',
        exercise: '<ul><li>Resistance training.</li><li>General adults: Squats, lunges, and dumbbell rows 2-3 times/week.</li><li>Older adults: Chair squats and resistance band exercises to maintain strength safely.</li></ul>',
        lifestyle: '<p>Stress reduction: Chronic stress elevates inflammatory cytokines (IL-6), accelerating bone resorption (Rondanelli et al., 2021). Mindfulness or Tai Chi can help.</p>'
    }
];

// --- Firestore Functions ---

const itemsCollection = collection(db, 'items');

// Helper to seed data if a specific category is empty
async function seedData() {
    console.log("Checking and seeding data if necessary...");
    const snapshot = await getDocs(itemsCollection);
    const allItems = snapshot.docs.map(doc => doc.data() as Item);

    const dataToSeed = [
        { category: 'FitnessAge', data: MOCK_FITNESS_AGE_DATA, type: 'FitnessAge' },
        { category: 'EBPS Intervention', data: MOCK_EBPS_DATA, type: 'EBPS Intervention' },
        { category: 'Symphony', data: MOCK_SYMPHONY_DATA, type: 'Symphony' },
        { 
            category: 'Reference', 
            data: [...fitnessAgeReferences, ...overallOmicAgeReferences, ...symphonyAgeReferences],
            type: 'Reference'
        }
    ];

    const batch = writeBatch(db);
    let batchHasWrites = false;

    for (const { category, data, type } of dataToSeed) {
        const existingItems = allItems.filter(item => item.category === category);
        if (existingItems.length === 0) {
            console.log(`Seeding data for category: ${category}`);
            batchHasWrites = true;
            if (type === 'Reference') {
                 data.forEach((item, index) => {
                    const docRef = doc(collection(db, 'items'));
                    const refItem = item as typeof fitnessAgeReferences[0];
                    batch.set(docRef, { 
                        text: refItem.text,
                        subCategory: refItem.subCategory,
                        category: 'Reference', 
                        order: index,
                        title: refItem.text.substring(0, 50) + '...'
                    });
                });
            } else {
                data.forEach((item, index) => {
                    const docRef = doc(collection(db, 'items'));
                    batch.set(docRef, { ...item, category: type, order: index });
                });
            }
        }
    }

    if (batchHasWrites) {
        await batch.commit();
        console.log("Seeding complete.");
    } else {
        console.log("All categories have data, no seeding required.");
    }

    // Migration for missing 'order' field
    const batchUpdateOrder = writeBatch(db);
    let orderUpdateNeeded = false;
    const itemsWithoutOrder = snapshot.docs.filter(doc => doc.data().order === undefined);
    
    if (itemsWithoutOrder.length > 0) {
        console.log("Some documents are missing 'order' field. Starting migration...");
        const itemsByCategory: Record<string, Item[]> = {};
        allItems.forEach(item => {
            if (!itemsByCategory[item.category]) {
                itemsByCategory[item.category] = [];
            }
            itemsByCategory[item.category].push(item);
        });

        for (const category in itemsByCategory) {
            itemsByCategory[category].sort((a,b) => (a.title || '').localeCompare(b.title || ''));
            itemsByCategory[category].forEach((item, index) => {
                 // Only update if order is actually missing to avoid unnecessary writes
                 if(item.order === undefined) {
                    const docRef = doc(db, 'items', item.id);
                    batchUpdateOrder.update(docRef, { order: index });
                    orderUpdateNeeded = true;
                 }
            });
        }
    }
    
    if (orderUpdateNeeded) {
        await batchUpdateOrder.commit();
        console.log("Order field migration complete.");
    }
}


// Call seedData on startup. In a real app, you might run this as a separate script.
seedData().catch(console.error);


export async function getItems(category: Item['category']): Promise<Item[]> {
  const q = query(itemsCollection, where("category", "==", category), orderBy("order"));
  
  try {
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
    return items;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      // This error means the composite index is missing.
      // We'll fall back to client-side sorting as a workaround.
      console.warn("Firestore index not found. Falling back to client-side sorting for category:", category);
      const allSnapshot = await getDocs(query(itemsCollection, where("category", "==", category)));
      const items = allSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
      
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return items;
    }
    // Re-throw other errors
    throw error;
  }
}

export async function getAllItems(): Promise<Item[]> {
  const snapshot = await getDocs(itemsCollection);
  const allItems = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Item));

  // Sort by category, then by order
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
    const itemsInCategory = await getItems(itemData.category);
    const maxOrder = itemsInCategory.reduce((max, item) => Math.max(max, item.order ?? -1), -1);
    
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
