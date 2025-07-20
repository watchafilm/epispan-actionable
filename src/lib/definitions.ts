export type FitnessAgeItem = {
  id: string;
  category: "FitnessAge";
  title: string;
  definition: string;
  relatedDisease: string;
  diet: string;
  exercise: string;
  lifestyle: string;
  order: number;
};

export type EBPSInterventionItem = {
  id:string;
  category: "EBPS Intervention";
  title: string;
  description: string;
  howShouldWeDo: string;
  biomarkersCategory: string;
  diet: string;
  recommendations: string;
  order: number;
};

export type SymphonyAgeItem = {
  id: string;
  category: "Symphony";
  title: string;
  diet: string;
  exercise: string;
  lifestyle: string;
  order: number;
};

export type ReferenceItem = {
  id: string;
  category: "Reference";
  title: string;
  value: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  order: number;
};


// A generic type for simplified list views like in the admin panel
export type BaseItem = {
  id: string;
  category: "FitnessAge" | "Symphony" | "EBPS Intervention" | "Reference";
  title: string;
  order: number;
  [key: string]: any; 
};


// A union type of all possible specific items
export type Item = FitnessAgeItem | EBPSInterventionItem | SymphonyAgeItem | ReferenceItem;
