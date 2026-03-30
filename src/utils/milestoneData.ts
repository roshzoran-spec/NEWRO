export interface Milestone {
  id: string;
  domain: "speech" | "motor" | "social" | "cognitive";
  question: string;
  minAge: number; // in months
  maxAge: number; // in months
  isCritical: boolean;
  emoji?: string;
}

// ─── SPEECH & LANGUAGE ────────────────────────────────────────────────────────
const SPEECH_QUESTIONS: Milestone[] = [
  { id: "s1",  domain: "speech", question: "Does your child coo or make gurgling sounds?", minAge: 0,  maxAge: 4,  isCritical: false, emoji: "🔊" },
  { id: "s2",  domain: "speech", question: "Does your child babble (ba-ba, da-da) repeatedly?", minAge: 4,  maxAge: 9,  isCritical: false, emoji: "💬" },
  { id: "s3",  domain: "speech", question: "Does your child respond to their name when called?", minAge: 6,  maxAge: 12,  isCritical: true,  emoji: "👂" },
  { id: "s4",  domain: "speech", question: "Does your child use gestures like waving 'bye-bye'?", minAge: 9,  maxAge: 14, isCritical: false, emoji: "👋" },
  { id: "s5",  domain: "speech", question: "Does your child say at least 1–2 clear words (like 'mama' or 'ball')?", minAge: 10, maxAge: 14, isCritical: true,  emoji: "🗣️" },
  { id: "s6",  domain: "speech", question: "Does your child point to objects or pictures in a book?", minAge: 12, maxAge: 18, isCritical: true,  emoji: "👆" },
  { id: "s7",  domain: "speech", question: "Does your child say at least 10 different words?", minAge: 15, maxAge: 20, isCritical: true,  emoji: "📢" },
  { id: "s8",  domain: "speech", question: "Can your child follow simple 1-step instructions ('give me the ball')?", minAge: 15, maxAge: 22, isCritical: false, emoji: "👂" },
  { id: "s9",  domain: "speech", question: "Does your child combine 2 words ('more juice', 'daddy go')?", minAge: 18, maxAge: 24, isCritical: true,  emoji: "💬" },
  { id: "s10", domain: "speech", question: "Does your child use at least 50 different words?", minAge: 24, maxAge: 30, isCritical: true,  emoji: "🗣️" },
  { id: "s11", domain: "speech", question: "Can your child tell you their name when asked?", minAge: 24, maxAge: 36, isCritical: false, emoji: "🏷️" },
  { id: "s12", domain: "speech", question: "Does your child form short sentences (3+ words)?", minAge: 30, maxAge: 36, isCritical: false, emoji: "📝" },
  { id: "s13", domain: "speech", question: "Can strangers understand most of what your child says?", minAge: 36, maxAge: 48, isCritical: false, emoji: "🤝" },
  { id: "s14", domain: "speech", question: "Does your child ask 'why' or 'what' questions?", minAge: 36, maxAge: 48, isCritical: false, emoji: "❓" },
  { id: "s15", domain: "speech", question: "Can your child tell a simple story about something that happened?", minAge: 48, maxAge: 60, isCritical: false, emoji: "📖" },
];

// ─── MOTOR SKILLS ─────────────────────────────────────────────────────────────
const MOTOR_QUESTIONS: Milestone[] = [
  { id: "m1",  domain: "motor", question: "Does your child hold their head up when on tummy?", minAge: 0,  maxAge: 4,  isCritical: false, emoji: "💪" },
  { id: "m2",  domain: "motor", question: "Does your child roll from tummy to back?", minAge: 3,  maxAge: 6,  isCritical: false, emoji: "🔄" },
  { id: "m3",  domain: "motor", question: "Can your child sit without support for at least a few seconds?", minAge: 5,  maxAge: 8,  isCritical: true,  emoji: "🪑" },
  { id: "m4",  domain: "motor", question: "Does your child pick up small objects using their thumb and finger (pincer grasp)?", minAge: 8,  maxAge: 12, isCritical: false, emoji: "🖐️" },
  { id: "m5",  domain: "motor", question: "Does your child crawl on hands and knees?", minAge: 7,  maxAge: 12, isCritical: false, emoji: "🏃" },
  { id: "m6",  domain: "motor", question: "Does your child pull to stand using furniture?", minAge: 9,  maxAge: 14, isCritical: false, emoji: "🧍" },
  { id: "m7",  domain: "motor", question: "Can your child walk without support?", minAge: 10, maxAge: 16, isCritical: true,  emoji: "🚶" },
  { id: "m8",  domain: "motor", question: "Can your child climb stairs with help?", minAge: 15, maxAge: 22, isCritical: false, emoji: "🪜" },
  { id: "m9",  domain: "motor", question: "Can your child hold a crayon and scribble?", minAge: 18, maxAge: 24, isCritical: false, emoji: "✏️" },
  { id: "m10", domain: "motor", question: "Can your child kick a ball forward?", minAge: 18, maxAge: 24, isCritical: false, emoji: "⚽" },
  { id: "m11", domain: "motor", question: "Can your child jump with both feet off the ground?", minAge: 24, maxAge: 30, isCritical: false, emoji: "🦘" },
  { id: "m12", domain: "motor", question: "Can your child run without falling often?", minAge: 24, maxAge: 36, isCritical: false, emoji: "🏃" },
  { id: "m13", domain: "motor", question: "Can your child draw a circle?", minAge: 30, maxAge: 42, isCritical: false, emoji: "⭕" },
  { id: "m14", domain: "motor", question: "Can your child catch a large ball most of the time?", minAge: 36, maxAge: 48, isCritical: false, emoji: "🏀" },
  { id: "m15", domain: "motor", question: "Can your child hop on one foot a few times?", minAge: 48, maxAge: 60, isCritical: false, emoji: "🦶" },
];

// ─── SOCIAL & EMOTIONAL ───────────────────────────────────────────────────────
const SOCIAL_QUESTIONS: Milestone[] = [
  { id: "so1",  domain: "social", question: "Does your child smile back when you smile at them?", minAge: 0,  maxAge: 4,  isCritical: true,  emoji: "😊" },
  { id: "so2",  domain: "social", question: "Does your child show excitement by moving their arms and legs?", minAge: 2,  maxAge: 5,  isCritical: false, emoji: "🎉" },
  { id: "so3",  domain: "social", question: "Does your child laugh when you play with them?", minAge: 4,  maxAge: 7,  isCritical: false, emoji: "😂" },
  { id: "so4",  domain: "social", question: "Does your child enjoy playing peek-a-boo?", minAge: 6,  maxAge: 9,  isCritical: false, emoji: "🙈" },
  { id: "so5",  domain: "social", question: "Does your child show 'stranger anxiety' (prefer familiar people)?", minAge: 6,  maxAge: 12, isCritical: false, emoji: "😟" },
  { id: "so6",  domain: "social", question: "Does your child copy sounds or simple actions that you make?", minAge: 9,  maxAge: 15, isCritical: true,  emoji: "🪞" },
  { id: "so7",  domain: "social", question: "Does your child show objects to you to share interest?", minAge: 12, maxAge: 18, isCritical: true,  emoji: "🎁" },
  { id: "so8",  domain: "social", question: "Does your child play simple pretend (feeding a doll, talking on phone)?", minAge: 18, maxAge: 24, isCritical: false, emoji: "🧸" },
  { id: "so9",  domain: "social", question: "Does your child show interest in other children?", minAge: 18, maxAge: 30, isCritical: false, emoji: "👫" },
  { id: "so10", domain: "social", question: "Does your child show affection spontaneously (hugs, kisses)?", minAge: 18, maxAge: 30, isCritical: false, emoji: "🤗" },
  { id: "so11", domain: "social", question: "Does your child take turns during play?", minAge: 30, maxAge: 42, isCritical: false, emoji: "🔄" },
  { id: "so12", domain: "social", question: "Does your child play cooperatively with other children?", minAge: 36, maxAge: 48, isCritical: false, emoji: "🤝" },
  { id: "so13", domain: "social", question: "Does your child understand the concept of 'mine' vs 'yours'?", minAge: 30, maxAge: 48, isCritical: false, emoji: "🏷️" },
  { id: "so14", domain: "social", question: "Can your child follow group instructions in a classroom setting?", minAge: 48, maxAge: 60, isCritical: false, emoji: "🏫" },
  { id: "so15", domain: "social", question: "Does your child have one or more preferred friends?", minAge: 48, maxAge: 72, isCritical: false, emoji: "💚" },
];

// ─── COGNITIVE ─────────────────────────────────────────────────────────────────
const COGNITIVE_QUESTIONS: Milestone[] = [
  { id: "c1",  domain: "cognitive", question: "Does your child track a moving object with their eyes?", minAge: 0,  maxAge: 4,  isCritical: false, emoji: "👀" },
  { id: "c2",  domain: "cognitive", question: "Does your child explore objects by mouthing or banging them?", minAge: 4,  maxAge: 9,  isCritical: false, emoji: "🧐" },
  { id: "c3",  domain: "cognitive", question: "Does your child look for a toy when you hide it?", minAge: 6,  maxAge: 12, isCritical: true,  emoji: "🔍" },
  { id: "c4",  domain: "cognitive", question: "Does your child understand the word 'no'?", minAge: 9,  maxAge: 15, isCritical: false, emoji: "🚫" },
  { id: "c5",  domain: "cognitive", question: "Can your child point to a body part (nose, eyes) when asked?", minAge: 12, maxAge: 18, isCritical: false, emoji: "👃" },
  { id: "c6",  domain: "cognitive", question: "Can your child sort objects by shape or color?", minAge: 18, maxAge: 24, isCritical: false, emoji: "🟦" },
  { id: "c7",  domain: "cognitive", question: "Does your child use objects for their intended purpose (spoon to eat)?", minAge: 15, maxAge: 22, isCritical: false, emoji: "🥄" },
  { id: "c8",  domain: "cognitive", question: "Can your child match similar objects together?", minAge: 18, maxAge: 30, isCritical: false, emoji: "🔗" },
  { id: "c9",  domain: "cognitive", question: "Does your child understand 'big' and 'little'?", minAge: 24, maxAge: 36, isCritical: false, emoji: "📏" },
  { id: "c10", domain: "cognitive", question: "Can your child count 2–3 objects?", minAge: 30, maxAge: 42, isCritical: false, emoji: "🔢" },
  { id: "c11", domain: "cognitive", question: "Can your child name basic colors (red, blue, green)?", minAge: 36, maxAge: 48, isCritical: false, emoji: "🎨" },
  { id: "c12", domain: "cognitive", question: "Does your child engage in simple fantasy play (make-believe)?", minAge: 30, maxAge: 48, isCritical: false, emoji: "🧚" },
  { id: "c13", domain: "cognitive", question: "Can your child count to 10 correctly?", minAge: 42, maxAge: 60, isCritical: false, emoji: "🔢" },
  { id: "c14", domain: "cognitive", question: "Does your child understand time concepts (yesterday, tomorrow)?", minAge: 48, maxAge: 60, isCritical: false, emoji: "🕐" },
  { id: "c15", domain: "cognitive", question: "Can your child write or recognize their own name?", minAge: 54, maxAge: 72, isCritical: false, emoji: "✍️" },
];

export const ALL_MILESTONE_QUESTIONS: Milestone[] = [
  ...SPEECH_QUESTIONS,
  ...MOTOR_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...COGNITIVE_QUESTIONS,
];

/**
 * Given the child's age in months, returns all milestone questions
 * that are appropriate for that age (minAge <= ageMonths <= maxAge + buffer).
 * Returns at least 12 per domain if possible.
 */
export const getQuestionsForAge = (ageMonths: number): Milestone[] => {
  const buffer = 6; // show questions within a buffer window
  const filtered = ALL_MILESTONE_QUESTIONS.filter(
    (q) => q.minAge <= ageMonths + buffer && q.maxAge + buffer >= Math.max(0, ageMonths - 6)
  );

  // Ensure at least some questions per domain if filter is too tight
  const domains: Array<Milestone["domain"]> = ["speech", "motor", "social", "cognitive"];
  const result: Milestone[] = [];

  domains.forEach((domain) => {
    const domainQs = filtered.filter((q) => q.domain === domain);
    if (domainQs.length < 5) {
      // fallback: take all domain questions sorted by proximity to ageMonths
      const allDomain = ALL_MILESTONE_QUESTIONS
        .filter((q) => q.domain === domain)
        .sort((a, b) => {
          const aMid = (a.minAge + a.maxAge) / 2;
          const bMid = (b.minAge + b.maxAge) / 2;
          return Math.abs(aMid - ageMonths) - Math.abs(bMid - ageMonths);
        })
        .slice(0, 12);
      result.push(...allDomain);
    } else {
      result.push(...domainQs);
    }
  });

  return result;
};

// Legacy exports for backward compatibility
export const MILESTONE_QUESTIONS: Milestone[] = ALL_MILESTONE_QUESTIONS.slice(0, 10);
export type { Milestone as MilestoneType };

export const CHILD_MOCK = {
  id: "child-1",
  name: "Your Child",
  dob: new Date(Date.now() - 30 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  ageMonths: 30,
  score: 72,
  status: "Monitor" as "On Track" | "Monitor" | "Needs Attention",
  insight: "Speech development requires monitoring. Engaging in daily reading and naming games is highly recommended.",
};

export const GRAPH_MOCK_DATA = [
  { age: 0,  expected: 0,  actual: 0,   predicted: 0   },
  { age: 6,  expected: 10, actual: 12,  predicted: 12  },
  { age: 12, expected: 25, actual: 22,  predicted: 22  },
  { age: 18, expected: 40, actual: 38,  predicted: 38  },
  { age: 24, expected: 55, actual: 50,  predicted: 50  },
  { age: 30, expected: 70, actual: 62,  predicted: 62  },
  { age: 36, expected: 85, actual: 72,  predicted: 75  },
  { age: 42, expected: 92, actual: null, predicted: 85 },
  { age: 48, expected: 98, actual: null, predicted: 95 },
];
