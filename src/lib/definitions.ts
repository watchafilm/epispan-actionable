export type FitnessAgeItem = {
  id: string;
  category: "FitnessAge";
  title: string;
  definition: string;
  relatedDisease: string;
  diet: string;
  exercise: string;
  lifestyle: string;
};

export type EBPSInterventionItem = {
  id: string;
  category: "EBPS Intervention";
  title: string; // e.g. Glucose
  description: string;
  howShouldWeDo: string;
  biomarkersCategory: string; // Formerly clinicalOutcomes
  diet: string;
  recommendations: string;
};

export type SymphonyItem = {
  id: string;
  category: "Symphony";
  title: string;
  value: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export type ReferenceItem = {
  id: string;
  category: "Reference";
  title: string;
  value: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};


// A generic type for simplified list views like in the admin panel
export type BaseItem = {
  id: string;
  category: "FitnessAge" | "Symphony" | "EBPS Intervention" | "Reference";
  title: string;
  [key: string]: any; 
};


// A union type of all possible specific items
export type Item = FitnessAgeItem | EBPSInterventionItem | SymphonyItem | ReferenceItem;
