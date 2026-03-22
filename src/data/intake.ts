// Patient intake data types and options

export interface ChildProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail: string;
  referredBy: string;
  chiefComplaint: string;
}

export interface MedicalHistory {
  birthType: string;
  gestationalAge: string;
  birthWeight: string;
  nicuStay: string;
  nicuDuration: string;
  birthComplications: string[];
  feedingHistory: string;
  currentFeeding: string[];
  medicalConditions: string[];
  medications: string;
  allergies: string;
  hearingScreening: string;
  visionScreening: string;
  familyHistory: string[];
}

export interface DevelopmentalHistory {
  headHolding: string;
  sitting: string;
  crawling: string;
  walking: string;
  firstWords: string;
  twoWordPhrases: string;
  currentSpeech: string;
  socialSmile: string;
  eyeContact: string;
  respondsToName: string;
  pointsToShow: string;
  pretendPlay: string;
  schoolStatus: string;
  schoolConcerns: string;
  previousTherapy: string[];
  previousDiagnosis: string;
}

export const birthTypeOptions = ["Normal vaginal delivery", "Cesarean section", "Assisted delivery (forceps/vacuum)", "Premature birth"];

export const birthComplicationOptions = [
  "None",
  "Low birth weight",
  "Birth asphyxia",
  "Jaundice requiring phototherapy",
  "Meconium aspiration",
  "Cord around neck",
  "Respiratory distress",
  "Seizures",
  "Other",
];

export const feedingOptions = [
  "Breastfed",
  "Bottle-fed",
  "Combination",
  "Tube-fed (history)",
  "Difficulty with solids",
  "Picky eater",
  "Texture aversion",
];

export const medicalConditionOptions = [
  "None",
  "Seizure disorder / Epilepsy",
  "Hearing impairment",
  "Vision impairment",
  "Cerebral palsy",
  "Down syndrome",
  "Cleft lip / palate",
  "Genetic condition",
  "Frequent ear infections",
  "Heart condition",
  "Other",
];

export const familyHistoryOptions = [
  "None",
  "Speech / Language delay",
  "Autism spectrum disorder",
  "ADHD",
  "Learning disability",
  "Hearing impairment",
  "Intellectual disability",
  "Other",
];

export const previousTherapyOptions = [
  "None",
  "Speech therapy",
  "Occupational therapy",
  "Behavioral therapy (ABA)",
  "Physical therapy",
  "Play therapy",
  "Special education",
  "Other",
];

export const milestoneAgeOptions = [
  "Not yet",
  "0-3 months",
  "3-6 months",
  "6-9 months",
  "9-12 months",
  "12-15 months",
  "15-18 months",
  "18-24 months",
  "24-36 months",
  "After 36 months",
];

export const chiefComplaintSuggestions = [
  "Not speaking age-appropriate words",
  "Delayed speech and language",
  "Not responding to name",
  "Poor eye contact",
  "Repetitive behaviors",
  "Hyperactivity and inattention",
  "Difficulty understanding instructions",
  "Feeding and swallowing difficulties",
  "Stuttering / Stammering",
  "Voice problems",
  "Social interaction concerns",
  "Regression of skills",
];
