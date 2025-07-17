import type { Item } from './definitions';

let items: Item[] = [
  {
    id: '1',
    category: 'FitnessAge',
    title: 'Gait Speed',
    value: '1.2 m/s',
    description: 'Speed of walking over a short distance; reflects lower body strength, coordination, and neurological function.',
    buttonText: 'Improve Gait Speed',
    buttonLink: '#',
  },
  {
    id: '2',
    category: 'FitnessAge',
    title: 'VO2MAX',
    value: '42 ml/kg/min',
    description: 'Maximum oxygen uptake during intense exercise. A key indicator of cardiovascular health.',
    buttonText: 'Improve Score',
    buttonLink: '#',
  },
  {
    id: '3',
    category: 'Symphony',
    title: 'Symphony Score',
    value: '8.2 / 10',
    description: 'A holistic measure of your well-being, combining physical, mental, and social health metrics.',
    buttonText: 'View Breakdown',
    buttonLink: '#',
  },
  {
    id: '4',
    category: 'EBPS Intervention',
    title: 'Recommended Intervention',
    value: 'HIIT',
    description: 'High-Intensity Interval Training is recommended to improve your VO2 Max and FitnessAge.',
    buttonText: 'Learn HIIT',
    buttonLink: '#',
  },
  {
    id: '5',
    category: 'Reference',
    title: 'Optimal Range',
    value: '45-50 years',
    description: 'The optimal FitnessAge range for your demographic group for longevity and healthspan.',
    buttonText: 'See References',
    buttonLink: '#',
  },
  {
    id: '6',
    category: 'FitnessAge',
    title: 'Grip Strength',
    value: '40 kg',
    description: 'Measures hand and forearm strength; correlated with overall muscle strength and functional status.',
    buttonText: 'Improve Grip',
    buttonLink: '#',
  },
  {
    id: '7',
    category: 'FitnessAge',
    title: 'FEV1',
    value: '4.0 L',
    description: 'Forced Expiratory Volume in 1 second; indicates lung function and respiratory health.',
    buttonText: 'Improve FEV1',
    buttonLink: '#',
  }
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export async function getItems(category?: Item['category']) {
  await new Promise(resolve => setTimeout(resolve, 100)); 
  if (category) {
    return items.filter((item) => item.category === category);
  }
  return items;
}

export async function getAllItems() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return items;
}


export async function addItem(itemData: Omit<Item, 'id'>) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newItem: Item = { ...itemData, id: generateId() };
  items.push(newItem);
  return newItem;
}

export async function updateItem(id: string, updates: Partial<Omit<Item, 'id'>>) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const itemIndex = items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }
  items[itemIndex] = { ...items[itemIndex], ...updates };
  return items[itemIndex];
}

export async function deleteItem(id: string) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = items.length;
  items = items.filter((item) => item.id !== id);
  if (items.length === initialLength) {
    throw new Error('Item not found');
  }
  return { success: true };
}
