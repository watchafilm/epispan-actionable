
'use server';

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, runTransaction, query, where, orderBy } from 'firebase/firestore';
import type { BaseItem, Item, FitnessAgeItem, EBPSInterventionItem, SymphonyAgeItem, ReferenceItem, OverallAgeItem } from './definitions';

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
        recommendations: "<p><strong>Diabetes Mellitus</strong>: Type 1 Diabetes: An autoimmune condition where the immune system attacks and destroys insulin-producing beta cells in the pancreas, leading to insufficient insulin production.<br><br>Type 2 Diabetes: Characterized by insulin resistance, where cells do not respond effectively to insulin, and a insufficient insulin production over time. It is often linked to lifestyle factors such as obesity and physical inactivity.</p><p><strong>Impaired Fasting Glucose (IFG) and Impaired Glucose Tolerance (IGT)</strong>: Conditions where blood glucose levels are higher than normal but not high enough for a diabetes diagnosis. These conditions increase the risk of developing type 2 diabetes.</p>"
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

const MOCK_OVERALL_AGE_DATA: Omit<OverallAgeItem, 'id' | 'category' | 'order'>[] = [
    {
        title: 'DunedinPace',
        description: '<p>Multiomic analysis integrates various biological data types— such as genomics, epigenomics, proteomics, and metabolomics— to offer a deeper understanding of complex biological systems. By combining these layers, it reveals how genes, proteins, and metabolites interact in health and disease.</p>',
        diets: '<h3>Dietary Patterns</h3><ul><li>Mediterranean and DGA-aligned diets show the strongest associations with slower DunedinPACE, mediated by high fiber intake, antioxidants, and anti-inflammatory nutrients.</li><li>Fiber-rich diets (≥12g/day) correlate with reduced DunedinPACE (-0.10 SD per 12g/day), likely due to gut microbiome benefits and metabolic regulation.</li><li>Moderate protein intake is advised, as higher protein consumption (≥33g/day) associates with accelerated epigenetic aging (+0.04 SD for GrimAge).</li><li>Omega-3 fatty acids (1g/day EPA/DHA) reduce biological aging metrics, with additive effects when combined with vitamin D (2,000 IU/day).</li><li>Polyphenol-rich foods (e.g., berries, nuts) and vitamin A may protect against amyloid/tau pathology, indirectly influencing brain-specific aging.</li></ul>',
        exercise: '<h3>Resistance Training</h3><ul><li>Strength training (30 minutes, 3x/week) synergizes with omega-3s and vitamin D, reducing PhenoAge biological age.</li><li>While aerobic exercise\'s direct impact on DunedinPACE isn\'t quantified, cohort studies link physical activity to slower GrimAge progression.</li></ul>',
        lifestyle: '<h3>Toxin Avoidance</h3><ul><li>Sugar-sweetened beverages (91g/day) increase DunedinPACE (+0.06 SD), while artificially sweetened drinks show similar risks.</li><li>Smoking cessation is critical, as smoking amplifies diet-related aging effects by upregulating inflammatory pathways.</li></ul><h3>Stress and Sleep</h3><p>Note: Current evidence from the provided studies focuses on diet and exercise. Broader literature suggests stress reduction and sleep quality influence aging biomarkers, but these were not directly assessed in the cited DunedinPACE research.</p>'
    },
    {
        title: 'OmicmAge',
        description: '<p>DunedinPACE is a DNA methylation-based algorithm developed by researchers at Duke and Columbia Universities to measure the pace of biological aging from a single blood sample. It was created using data from the Dunedin Study, a long-term cohort following over 1,000 individuals born in 1972-1973 in Dunedin, New Zealand, with decades of health and lifestyle data.</p>',
        diets: '<h3>Anti-inflammatory Diets</h3><ul><li>DASH and Mediterranean diets reduce odds of accelerated OMICmAge by 15-50% (OR 0.50-0.85) compared to standard diets, mediated by lower systemic inflammation and lipid profiles.</li><li>Polyphenol-rich supplements (e.g., Tartary buckwheat extract) show bidirectional effects: +0.31 SD acceleration in OMICmAge for those with initially low biological age. -0.28 SD deceleration in individuals with high baseline OMICmAge.</li></ul><h3>Key Drivers</h3><ul><li>Fiber intake (>30g/day) and omega-3/6 balance correlate with -0.15 SD OMICmAge reduction over 12 months.</li><li>High dietary inflammatory index (DII) increases odds of accelerated aging by 25-61%.</li></ul>',
        exercise: '<p>No OMICmAge-specific exercise trials exist, but multi-omics data suggest:</p><ul><li>Resistance training synergizes with protein intake to reduce proteomic aging biomarkers linked to OMICmAge.</li><li>Cohort studies associate 150+ mins/week aerobic activity with -0.12 SD in multi-omic aging scores.</li></ul>',
        lifestyle: '<h3>Sleep and Stress</h3><p>No direct OMICmAge studies identified, but proteomic clocks show:</p><ul><li>&lt;6h sleep/night associates with +0.18 SD acceleration in related metrics.</li><li>Mindfulness practices reduce inflammatory cytokines implicated in OMICmAge pathways.</li></ul><h3>Social Behavior</h3><p>Limited multi-omics data, though transcriptomic studies link strong social ties to -0.09 SD aging rat.</p>'
    }
];

// --- Firestore Functions ---

const itemsCollection = collection(db, 'items');

// Helper to seed data if a specific category is empty
async function seedData() {
    console.log("Checking and seeding data if necessary...");
    const allItemsSnapshot = await getDocs(itemsCollection);
    const allItems = allItemsSnapshot.docs.map(doc => doc.data() as Item);

    const dataToSeed = [
        { category: 'FitnessAge', data: MOCK_FITNESS_AGE_DATA, type: 'FitnessAge' },
        { category: 'EBPS Intervention', data: MOCK_EBPS_DATA, type: 'EBPS Intervention' },
        { category: 'Symphony', data: MOCK_SYMPHONY_DATA, type: 'Symphony' },
        { category: 'OverallAge', data: MOCK_OVERALL_AGE_DATA, type: 'OverallAge'},
        { 
            category: 'Reference', 
            data: [],
            type: 'Reference'
        }
    ];

    const batch = writeBatch(db);
    let batchHasWrites = false;

    for (const { category, data, type } of dataToSeed) {
        const existingItems = allItems.filter(item => item.category === category);
        if (existingItems.length === 0 && data.length > 0) {
            console.log(`Seeding data for category: ${category}`);
            batchHasWrites = true;
            data.forEach((item, index) => {
                const docRef = doc(collection(db, 'items'));
                batch.set(docRef, { ...item, category: type, order: index });
            });
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
    const itemsWithoutOrder = allItemsSnapshot.docs.filter(doc => doc.data().order === undefined);
    
    if (itemsWithoutOrder.length > 0) {
        console.log("Some documents are missing 'order' field. Starting migration...");
        const itemsByCategory: Record<string, Item[]> = {};

        // Populate itemsByCategory with all existing items
        allItemsSnapshot.docs.forEach(doc => {
            const item = {id: doc.id, ...doc.data()} as Item;
             if (!itemsByCategory[item.category]) {
                itemsByCategory[item.category] = [];
            }
            itemsByCategory[item.category].push(item);
        });


        for (const category in itemsByCategory) {
            // Sort each category by a default property if order is missing (e.g., title)
            itemsByCategory[category].sort((a,b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                return (a.title || '').localeCompare(b.title || '');
            });

            // Assign new order to all items in the category
            itemsByCategory[category].forEach((item, index) => {
                 if(item.order !== index) { // Update if order is missing or incorrect
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


export async function getItems(category: Item['category'] | null): Promise<Item[]> {
    let q;
    if (category) {
        q = query(itemsCollection, where("category", "==", category), orderBy("order"));
    } else {
        q = query(itemsCollection, orderBy("category"), orderBy("order"));
    }
    
    try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
    } catch (error: any) {
        if (error.code === 'failed-precondition') {
          console.warn(`Firestore index not found for query. Falling back to client-side sorting.`);
          
          let fallbackQuery;
          if (category) {
              fallbackQuery = query(itemsCollection, where("category", "==", category));
          } else {
              fallbackQuery = query(itemsCollection);
          }
          
          const snapshot = await getDocs(fallbackQuery);
          const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
          
          // Sort manually
          items.sort((a, b) => {
            if (category) { // If filtering by category, just sort by order
                 return (a.order ?? 0) - (b.order ?? 0);
            }
            // if no category filter, sort by category first, then order
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return (a.order ?? 0) - (b.order ?? 0);
          });
          
          return items;
        }
        console.error("Error fetching items for category", category, error);
        throw error; // Re-throw other errors
    }
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

export async function addMultipleItems(itemsData: Omit<Item, 'id' | 'order'>[]) {
    if (itemsData.length === 0) return;

    const category = itemsData[0].category;
    
    await runTransaction(db, async (transaction) => {
        const itemsInCategory = await getItems(category);
        let maxOrder = itemsInCategory.reduce((max, item) => Math.max(max, item.order ?? -1), -1);
        
        for (const itemData of itemsData) {
            maxOrder++;
            const newItem = {
                ...itemData,
                order: maxOrder,
            };
            const newDocRef = doc(itemsCollection);
            transaction.set(newDocRef, newItem);
        }
    });
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
