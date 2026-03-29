export interface Milestone {
  id: string;
  domain: "speech" | "motor" | "social" | "cognitive" | "feeding";
  question: string;
  minAge: number; // in months
  maxAge: number; // in months
  isCritical: boolean;
}

export const CHILD_MOCK = {
  id: "child-1",
  name: "Ayaan",
  dob: "2021-05-15",
  ageMonths: 40,
  score: 72,
  status: "Monitor" as "On Track" | "Monitor" | "Needs Attention",
  insight: "Speech development slightly delayed. Monitoring recommended."
};

export const MILESTONE_QUESTIONS: Milestone[] = [
  // Speech & Language
  { 
    id: "s1", 
    domain: "speech", 
    question: "Does your child say simple words like 'mama' or 'ball'?", 
    minAge: 12, maxAge: 18, isCritical: true 
  },
  { 
    id: "s2", 
    domain: "speech", 
    question: "Does your child point to things they want?", 
    minAge: 14, maxAge: 20, isCritical: true 
  },
  { 
    id: "s3", 
    domain: "speech", 
    question: "Does your child say 2-word sentences like 'more milk'?", 
    minAge: 24, maxAge: 30, isCritical: true 
  },
  { 
    id: "s4", 
    domain: "speech", 
    question: "Does your child use at least 50 words regularly?", 
    minAge: 24, maxAge: 36, isCritical: false 
  },
  
  // Motor Skills
  { 
    id: "m1", 
    domain: "motor", 
    question: "Does your child walk without support?", 
    minAge: 12, maxAge: 16, isCritical: true 
  },
  { 
    id: "m2", 
    domain: "motor", 
    question: "Can your child jump with both feet off the ground?", 
    minAge: 24, maxAge: 30, isCritical: false 
  },
  { 
    id: "m3", 
    domain: "motor", 
    question: "Can your child hold a crayon to scribble or draw?", 
    minAge: 18, maxAge: 24, isCritical: false 
  },
  
  // Social Skills
  { 
    id: "so1", 
    domain: "social", 
    question: "Does your child respond when you call their name?", 
    minAge: 9, maxAge: 12, isCritical: true 
  },
  { 
    id: "so2", 
    domain: "social", 
    question: "Does your child play with others or show interest in peers?", 
    minAge: 24, maxAge: 36, isCritical: false 
  },
  { 
    id: "so3", 
    domain: "social", 
    question: "Does your child copy sounds or words you make?", 
    minAge: 12, maxAge: 18, isCritical: true 
  }
];

export const GRAPH_MOCK_DATA = [
  { age: 0, expected: 0, actual: 0, predicted: 0 },
  { age: 6, expected: 10, actual: 12, predicted: 12 },
  { age: 12, expected: 25, actual: 22, predicted: 22 },
  { age: 18, expected: 40, actual: 38, predicted: 38 },
  { age: 24, expected: 55, actual: 50, predicted: 50 },
  { age: 30, expected: 70, actual: 62, predicted: 62 },
  { age: 36, expected: 85, actual: 72, predicted: 75 },
  { age: 42, expected: 92, actual: null, predicted: 85 },
  { age: 48, expected: 98, actual: null, predicted: 95 }
];
