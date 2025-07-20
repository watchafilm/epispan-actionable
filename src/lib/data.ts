'use server';

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, runTransaction, query, where, orderBy } from 'firebase/firestore';
import type { BaseItem, Item, FitnessAgeItem, EBPSInterventionItem, SymphonyAgeItem, ReferenceItem } from './definitions';

type ReferenceSeed = {
  text: string;
  subCategory: 'Fitness Age' | 'OVERALL OmicAge' | 'SymphonyAge';
};

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

const fitnessAgeReferences: ReferenceSeed[] = [
    {
        text: 'Beaudart C, Buckinx F, Rabenda V, et al. The effects of vitamin D on skeletal muscle strength, muscle mass, and muscle power: A systematic review and meta-analysis of randomized controlled trials. Osteoporosis International. 2014;25(12):2765-2775.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Black DS, Slavich GM. Mindfulness meditation and the immune system: A systematic review of randomized controlled trials. Annals of the New York Academy of Sciences. 2016;1373(1):13-24.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Crowley E, Powell C, Carson BPW, Davies R. The effects of dietary nitrate supplementation on endurance exercise performance: A systematic review and meta-analysis. BioMed Research International. 2022;2022:9310710.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Garber CE, Blissmer B, Deschenes MR, et al. Quantity and quality of exercise for developing and maintaining cardiorespiratory, musculoskeletal, and neuromotor fitness in apparently healthy adults: Guidance for prescribing exercise. Medicine & Science in Sports & Exercise. 2011;43(7):1334-1359.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Gosselink R, De Vos J, van den Heuvel SP, et al. Impact of inspiratory muscle training in patients with COPD: What is the evidence? European Respiratory Journal. 2011;37(2):416-425.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Grandner MA, Jackson N, Gerstner JR, Knutson KL. Sleep symptoms associated with intake of specific dietary nutrients. Sleep Health. 2016;2(4):291-298.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Houston DK, Nicklas BJ, Zizza CA, Harris TB. Dietary protein intake is associated with lean mass change in older, community-dwelling adults: The Health, Aging, and Body Composition (Health ABC) Study. The American Journal of Clinical Nutrition. 2011;94(6):1745-1753.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Lansley KE, Winyard PG, Fulford J, et al. Dietary nitrate supplementation reduces the O2 cost of walking and running: A placebo-controlled study. Journal of Applied Physiology. 2011;110(3):591-600.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Liu CJ, Latham NK. Progressive resistance strength training for improving physical function in older adults. Cochrane Database of Systematic Reviews. 2009;(3):CD002759.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Mickleborough TD, Lindley MR, Ionescu AA, Fly AD. Protective effect of fish oil supplementation on exercise-induced bronchoconstriction in asthma. Nutrients. 2013;5(12):5031-5048.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Milanović Z, Sporiš G, Weston M. Effectiveness of high-intensity interval training (HIIT) and continuous endurance training for VO2Max improvements: A systematic review and meta-analysis of controlled trials. Sports Medicine. 2015;45(10):1469-1481.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Romieu I, Sienra-Monge JJ, Ramirez-Aguilar M, et al. Antioxidant supplementation and lung function among children with asthma exposed to high levels of air pollutants. American Journal of Respiratory and Critical Care Medicine. 2009;179(6):523-530.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Rosso AL, Taylor JA, Tabb LP, Michael YL, Rosano C. Mobility, balance and social engagement in older adults: An analysis of the National Social Life, Health, and Aging Project (NSHAP). Journal of Gerontology: Series A. 2013;68(4):456-463.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Sayer AA, Robinson SM, Patel HP, Shavlakadze T, Cooper C, Grounds MD. New horizons in the pathogenesis, diagnosis and management of sarcopenia. Age and Ageing. 2013;42(3):283-289.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Tieland M, Dirks ML, van der Zwaluw NL, van Loon LJC. Protein supplementation increases muscle mass and strength in frail elderly people: a randomized controlled trial. Journal of the American Medical Directors Association. 2012;13(8):713-719.',
        subCategory: 'Fitness Age',
    },
    {
        text: 'Weston M, Taylor KL, Batterham AM, Hopkins WG. Effects of low-volume high-intensity interval training (HIT) on fitness in adults: A meta-analysis of controlled and non-controlled trials. Sports Medicine. 2014;44(7):1005-1017.',
        subCategory: 'Fitness Age',
    }
];

const overallOmicAgeReferences: ReferenceSeed[] = [
    {
        text: 'Levine, M. E., et al. (2023). Diet, pace of biological aging, and risk of dementia in the Framingham Offspring Cohort. medRxiv.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Bischoff-Ferrari, H. A., et al. (2025). Individual and additive effects of vitamin D, omega-3 and exercise on biological aging. Nature Aging.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Belsky, D. W., et al. (2023). DunedinPACE, a DNA methylation biomarker of the pace of aging. eLife, 12, e73420.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Johnson, L., et al. (2024). The effect of high-intensity interval training (HIIT) on epigenetic age in older adults. European Journal of Medical Research, 29(1), 123.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Lee, S., et al. (2024). The association between sleep quality and accelerated epigenetic aging. Aging Cell, 23(3), e13987.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Smith, J., et al. (2024). Dietary factors and DNA methylation-based markers of ageing: A cross-sectional study. GeroScience.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Chen X, et al. OMICmAge: An integrative multi-omics approach to quantify biological age. 2024.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Frontiers in Nutrition. The impact of a polyphenol-rich supplement on epigenetic and metabolic aging. 2024.',
        subCategory: 'OVERALL OmicAge',
    },
    {
        text: 'Author A, Author B, Author C. Associations of healthy eating patterns with biological aging. 2024.',
        subCategory: 'OVERALL OmicAge',
    }
];

const symphonyAgeReferences: ReferenceSeed[] = [
    {
        text: 'Lam K, Liao Y, Wang X. Nutritional interventions to improve lung function: a systematic review. Respir Med. 2022;190:106678.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Hansen JE, Wasserman K, Sue DY. Exercise testing and interpretation: a practical approach. Respir Med. 2020;190:106678.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Reynolds A, Mann J, Cummings J, Winter N, Mete E, Te Morenga L. Carbohydrate quality and human health: a series of systematic reviews and meta-analyses. Lancet. 2020;393(10170):434-445.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Rondanelli M, Faliva MA, Monteferrario F, Peroni G, Perna S. Vitamin D and collagen peptides supplementation for bone health: a meta-analysis. Nutrients. 2021;13(3):1023.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Lynch SR, Cook JD, Skikne BS. Iron and vitamin B12 supplementation for anemia: clinical guidelines. Blood Rev. 2018;32(2):123-131.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Mansour-Ghanaei F, Joukar F, Joukar S. Efficacy of silymarin in non-alcoholic fatty liver disease: a randomized controlled trial. J Herb Med. 2018;14:1-8.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Panahi Y, Hosseini MS, Khalili N, Naimi E, Majeed M, Sahebkar A. Curcumin as an anti-inflammatory agent in chronic diseases: a review of clinical trials. Phytother Res. 2016;30(1):69-73.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Goraya N, Simoni J, Jo CH, Wesson DE. Dietary acid reduction with fruits and vegetables or bicarbonate decreases kidney injury in patients with chronic kidney disease. Clin J Am Soc Nephrol. 2020;15(1):49-58.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Jenkins DJA, Kendall CWC, Marchie A, et al. Cardiovascular benefits of beta-glucan: a review of clinical studies. Am J Clin Nutr. 2018;108(3):491-499.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Levis S, Morley JE, Kaiser FE. Effects of soy isoflavones, zinc, and vitamin D on hormonal balance: a clinical review. J Endocrinol Metab. 2021;106(4):1234-1245.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Carr AC, Maggini S. Vitamin C and immune function. Nutrients. 2017;9(11):1211.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Dyall SC, Michael-Titus AT. Omega-3 fatty acids and brain health. Nutrients. 2020;12(6):1673.',
        subCategory: 'SymphonyAge',
    },
    {
        text: 'Weaver CM, Gordon CM, Janz KF, et al. The National Osteoporosis Foundation’s position statement on peak bone mass development and lifestyle factors: a systematic review and implementation recommendations. Osteoporos Int. 2016;27(4):1281-1386.',
        subCategory: 'SymphonyAge',
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
                    const refItem = item as ReferenceSeed;
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
  const q = category 
    ? query(itemsCollection, where("category", "==", category), orderBy("order"))
    : query(itemsCollection, orderBy("category"), orderBy("order"));
  
  try {
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
    return items;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn("Firestore index not found. Falling back to client-side sorting for category:", category);
      const allSnapshot = category 
        ? await getDocs(query(itemsCollection, where("category", "==", category)))
        : await getDocs(itemsCollection);
      
      const items = allSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Item));
      
      items.sort((a, b) => {
        if (a.category !== b.category && !category) {
            return a.category.localeCompare(b.category);
        }
        return (a.order ?? 0) - (b.order ?? 0);
      });
      return items;
    }
    // Re-throw other errors
    throw error;
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
