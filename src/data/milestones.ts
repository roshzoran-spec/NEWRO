// Clinical Milestone Database — Speech/Language & Motor (0–72 months)

export interface Milestone {
  id: string;
  ageMonth: number;
  domain: "speech" | "motor";
  description: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
}

export interface MilestoneScore {
  milestoneId: string;
  score: 0 | 1 | 2 | 3; // 0=Not achieved, 1=Emerging, 2=Achieved, 3=Advanced
}

export interface MilestoneSession {
  id: string;
  childName: string;
  childAgeMonths: number;
  scores: MilestoneScore[];
  createdAt: string;
}

export const scoreLabels: Record<number, { label: string; color: string }> = {
  0: { label: "Not Achieved", color: "bg-destructive/20 text-destructive" },
  1: { label: "Emerging", color: "bg-yellow-100 text-yellow-700" },
  2: { label: "Achieved", color: "bg-secondary text-primary" },
  3: { label: "Advanced", color: "bg-primary/20 text-primary" },
};

export const milestones: Milestone[] = [
  // === SPEECH & LANGUAGE ===
  // 0-3 months
  { id: "sp-01", ageMonth: 3, domain: "speech", description: "Coos and produces vowel sounds", category: "Vocalization", difficulty: "basic" },
  { id: "sp-02", ageMonth: 3, domain: "speech", description: "Startles or quiets to sounds", category: "Receptive", difficulty: "basic" },
  { id: "sp-03", ageMonth: 3, domain: "speech", description: "Differentiates cries for different needs", category: "Vocalization", difficulty: "basic" },
  // 4-6 months
  { id: "sp-04", ageMonth: 6, domain: "speech", description: "Babbles with consonant-vowel combos (ba, da, ma)", category: "Vocalization", difficulty: "basic" },
  { id: "sp-05", ageMonth: 6, domain: "speech", description: "Turns toward voice or sound source", category: "Receptive", difficulty: "basic" },
  { id: "sp-06", ageMonth: 6, domain: "speech", description: "Laughs and squeals", category: "Vocalization", difficulty: "basic" },
  { id: "sp-07", ageMonth: 6, domain: "speech", description: "Responds to changes in tone of voice", category: "Receptive", difficulty: "basic" },
  // 7-9 months
  { id: "sp-08", ageMonth: 9, domain: "speech", description: "Responds to own name", category: "Receptive", difficulty: "basic" },
  { id: "sp-09", ageMonth: 9, domain: "speech", description: "Variegated babbling (bada, maba)", category: "Vocalization", difficulty: "basic" },
  { id: "sp-10", ageMonth: 9, domain: "speech", description: "Understands 'no'", category: "Receptive", difficulty: "basic" },
  { id: "sp-11", ageMonth: 9, domain: "speech", description: "Uses gestures (waving, reaching)", category: "Expressive", difficulty: "basic" },
  // 10-12 months
  { id: "sp-12", ageMonth: 12, domain: "speech", description: "Says first meaningful word (mama, dada)", category: "Expressive", difficulty: "basic" },
  { id: "sp-13", ageMonth: 12, domain: "speech", description: "Understands simple instructions with gestures", category: "Receptive", difficulty: "basic" },
  { id: "sp-14", ageMonth: 12, domain: "speech", description: "Uses jargon with intonation patterns", category: "Expressive", difficulty: "basic" },
  { id: "sp-15", ageMonth: 12, domain: "speech", description: "Points to request or show interest", category: "Expressive", difficulty: "basic" },
  // 13-18 months
  { id: "sp-16", ageMonth: 18, domain: "speech", description: "Uses 10–20 recognizable words", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-17", ageMonth: 18, domain: "speech", description: "Identifies body parts when asked", category: "Receptive", difficulty: "intermediate" },
  { id: "sp-18", ageMonth: 18, domain: "speech", description: "Follows simple commands without gestures", category: "Receptive", difficulty: "intermediate" },
  { id: "sp-19", ageMonth: 18, domain: "speech", description: "Attempts to imitate new words", category: "Expressive", difficulty: "intermediate" },
  // 19-24 months
  { id: "sp-20", ageMonth: 24, domain: "speech", description: "Combines two words (more milk, go car)", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-21", ageMonth: 24, domain: "speech", description: "Vocabulary of 50+ words", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-22", ageMonth: 24, domain: "speech", description: "Follows two-step commands", category: "Receptive", difficulty: "intermediate" },
  { id: "sp-23", ageMonth: 24, domain: "speech", description: "Uses pronouns (me, mine, you)", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-24", ageMonth: 24, domain: "speech", description: "Speech understood by familiar people ~50%", category: "Articulation", difficulty: "intermediate" },
  // 25-36 months
  { id: "sp-25", ageMonth: 36, domain: "speech", description: "Uses 3–4 word sentences", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-26", ageMonth: 36, domain: "speech", description: "Asks 'what' and 'where' questions", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-27", ageMonth: 36, domain: "speech", description: "Understands prepositions (in, on, under)", category: "Receptive", difficulty: "intermediate" },
  { id: "sp-28", ageMonth: 36, domain: "speech", description: "Names common objects and pictures", category: "Expressive", difficulty: "intermediate" },
  { id: "sp-29", ageMonth: 36, domain: "speech", description: "Speech understood by strangers ~75%", category: "Articulation", difficulty: "intermediate" },
  // 37-48 months
  { id: "sp-30", ageMonth: 48, domain: "speech", description: "Uses complex sentences (because, if, when)", category: "Expressive", difficulty: "advanced" },
  { id: "sp-31", ageMonth: 48, domain: "speech", description: "Tells short stories or narrates events", category: "Expressive", difficulty: "advanced" },
  { id: "sp-32", ageMonth: 48, domain: "speech", description: "Understands concepts of time (yesterday, tomorrow)", category: "Receptive", difficulty: "advanced" },
  { id: "sp-33", ageMonth: 48, domain: "speech", description: "Asks 'why' and 'how' questions", category: "Expressive", difficulty: "advanced" },
  { id: "sp-34", ageMonth: 48, domain: "speech", description: "Follows three-step instructions", category: "Receptive", difficulty: "advanced" },
  // 49-60 months
  { id: "sp-35", ageMonth: 60, domain: "speech", description: "Uses grammatically correct sentences", category: "Expressive", difficulty: "advanced" },
  { id: "sp-36", ageMonth: 60, domain: "speech", description: "Defines simple words", category: "Expressive", difficulty: "advanced" },
  { id: "sp-37", ageMonth: 60, domain: "speech", description: "Understands rhyming", category: "Receptive", difficulty: "advanced" },
  { id: "sp-38", ageMonth: 60, domain: "speech", description: "Engages in extended conversation", category: "Expressive", difficulty: "advanced" },
  // 61-72 months
  { id: "sp-39", ageMonth: 72, domain: "speech", description: "Uses figurative language and humor", category: "Expressive", difficulty: "advanced" },
  { id: "sp-40", ageMonth: 72, domain: "speech", description: "Retells stories with sequence and detail", category: "Expressive", difficulty: "advanced" },
  { id: "sp-41", ageMonth: 72, domain: "speech", description: "Speech understood clearly by all listeners", category: "Articulation", difficulty: "advanced" },
  { id: "sp-42", ageMonth: 72, domain: "speech", description: "Understands complex instructions and stories", category: "Receptive", difficulty: "advanced" },

  // === MOTOR ===
  // 0-3 months
  { id: "mt-01", ageMonth: 3, domain: "motor", description: "Holds head steady when upright", category: "Gross Motor", difficulty: "basic" },
  { id: "mt-02", ageMonth: 3, domain: "motor", description: "Brings hands to midline", category: "Fine Motor", difficulty: "basic" },
  { id: "mt-03", ageMonth: 3, domain: "motor", description: "Lifts head during tummy time", category: "Gross Motor", difficulty: "basic" },
  // 4-6 months
  { id: "mt-04", ageMonth: 6, domain: "motor", description: "Rolls over (front to back and back to front)", category: "Gross Motor", difficulty: "basic" },
  { id: "mt-05", ageMonth: 6, domain: "motor", description: "Reaches for and grasps objects", category: "Fine Motor", difficulty: "basic" },
  { id: "mt-06", ageMonth: 6, domain: "motor", description: "Transfers objects between hands", category: "Fine Motor", difficulty: "basic" },
  { id: "mt-07", ageMonth: 6, domain: "motor", description: "Bears weight on legs when held standing", category: "Gross Motor", difficulty: "basic" },
  // 7-9 months
  { id: "mt-08", ageMonth: 9, domain: "motor", description: "Sits without support", category: "Gross Motor", difficulty: "basic" },
  { id: "mt-09", ageMonth: 9, domain: "motor", description: "Crawls on hands and knees", category: "Gross Motor", difficulty: "basic" },
  { id: "mt-10", ageMonth: 9, domain: "motor", description: "Uses pincer grasp (thumb and finger)", category: "Fine Motor", difficulty: "basic" },
  { id: "mt-11", ageMonth: 9, domain: "motor", description: "Pulls to stand using furniture", category: "Gross Motor", difficulty: "basic" },
  // 10-12 months
  { id: "mt-12", ageMonth: 12, domain: "motor", description: "Stands independently", category: "Gross Motor", difficulty: "basic" },
  { id: "mt-13", ageMonth: 12, domain: "motor", description: "Takes first independent steps", category: "Gross Motor", difficulty: "basic" },
  { id: "mt-14", ageMonth: 12, domain: "motor", description: "Stacks 2 blocks", category: "Fine Motor", difficulty: "basic" },
  { id: "mt-15", ageMonth: 12, domain: "motor", description: "Releases objects deliberately", category: "Fine Motor", difficulty: "basic" },
  // 13-18 months
  { id: "mt-16", ageMonth: 18, domain: "motor", description: "Walks independently and confidently", category: "Gross Motor", difficulty: "intermediate" },
  { id: "mt-17", ageMonth: 18, domain: "motor", description: "Scribbles with crayon", category: "Fine Motor", difficulty: "intermediate" },
  { id: "mt-18", ageMonth: 18, domain: "motor", description: "Stacks 3–4 blocks", category: "Fine Motor", difficulty: "intermediate" },
  { id: "mt-19", ageMonth: 18, domain: "motor", description: "Walks up stairs with hand held", category: "Gross Motor", difficulty: "intermediate" },
  // 19-24 months
  { id: "mt-20", ageMonth: 24, domain: "motor", description: "Runs with coordination", category: "Gross Motor", difficulty: "intermediate" },
  { id: "mt-21", ageMonth: 24, domain: "motor", description: "Kicks a ball forward", category: "Gross Motor", difficulty: "intermediate" },
  { id: "mt-22", ageMonth: 24, domain: "motor", description: "Turns pages of a book one at a time", category: "Fine Motor", difficulty: "intermediate" },
  { id: "mt-23", ageMonth: 24, domain: "motor", description: "Stacks 6+ blocks", category: "Fine Motor", difficulty: "intermediate" },
  // 25-36 months
  { id: "mt-24", ageMonth: 36, domain: "motor", description: "Climbs stairs alternating feet", category: "Gross Motor", difficulty: "intermediate" },
  { id: "mt-25", ageMonth: 36, domain: "motor", description: "Pedals a tricycle", category: "Gross Motor", difficulty: "intermediate" },
  { id: "mt-26", ageMonth: 36, domain: "motor", description: "Draws a circle", category: "Fine Motor", difficulty: "intermediate" },
  { id: "mt-27", ageMonth: 36, domain: "motor", description: "Uses scissors to snip paper", category: "Fine Motor", difficulty: "intermediate" },
  { id: "mt-28", ageMonth: 36, domain: "motor", description: "Jumps with both feet off ground", category: "Gross Motor", difficulty: "intermediate" },
  // 37-48 months
  { id: "mt-29", ageMonth: 48, domain: "motor", description: "Hops on one foot", category: "Gross Motor", difficulty: "advanced" },
  { id: "mt-30", ageMonth: 48, domain: "motor", description: "Catches a bounced ball", category: "Gross Motor", difficulty: "advanced" },
  { id: "mt-31", ageMonth: 48, domain: "motor", description: "Draws a person (head + 2 body parts)", category: "Fine Motor", difficulty: "advanced" },
  { id: "mt-32", ageMonth: 48, domain: "motor", description: "Buttons and unbuttons clothing", category: "Fine Motor", difficulty: "advanced" },
  // 49-60 months
  { id: "mt-33", ageMonth: 60, domain: "motor", description: "Skips with alternating feet", category: "Gross Motor", difficulty: "advanced" },
  { id: "mt-34", ageMonth: 60, domain: "motor", description: "Writes some letters or numbers", category: "Fine Motor", difficulty: "advanced" },
  { id: "mt-35", ageMonth: 60, domain: "motor", description: "Cuts along a line with scissors", category: "Fine Motor", difficulty: "advanced" },
  { id: "mt-36", ageMonth: 60, domain: "motor", description: "Balances on one foot for 5+ seconds", category: "Gross Motor", difficulty: "advanced" },
  // 61-72 months
  { id: "mt-37", ageMonth: 72, domain: "motor", description: "Rides bicycle with training wheels", category: "Gross Motor", difficulty: "advanced" },
  { id: "mt-38", ageMonth: 72, domain: "motor", description: "Ties simple knots", category: "Fine Motor", difficulty: "advanced" },
  { id: "mt-39", ageMonth: 72, domain: "motor", description: "Copies complex shapes (diamond, triangle)", category: "Fine Motor", difficulty: "advanced" },
  { id: "mt-40", ageMonth: 72, domain: "motor", description: "Throws and catches ball accurately", category: "Gross Motor", difficulty: "advanced" },
];

// Get milestones applicable for a given age
export function getMilestonesForAge(ageMonths: number, domain?: "speech" | "motor"): Milestone[] {
  return milestones.filter(
    m => m.ageMonth <= ageMonths && (domain ? m.domain === domain : true)
  );
}

// Calculate achievement percentage for a domain
export function calculateAchievement(
  scores: MilestoneScore[],
  domain: "speech" | "motor",
  ageMonths: number
): number {
  const applicable = getMilestonesForAge(ageMonths, domain);
  if (applicable.length === 0) return 0;
  const maxPossible = applicable.length * 3;
  const totalScore = applicable.reduce((sum, m) => {
    const s = scores.find(sc => sc.milestoneId === m.id);
    return sum + (s ? s.score : 0);
  }, 0);
  return Math.round((totalScore / maxPossible) * 100);
}

// Determine traffic light status
export function getTrafficLight(
  ageMonths: number,
  scores: MilestoneScore[],
  domain: "speech" | "motor"
): { status: "green" | "yellow" | "red"; label: string; description: string } {
  const applicable = getMilestonesForAge(ageMonths, domain);
  if (applicable.length === 0) return { status: "green", label: "On Track", description: "No milestones expected yet" };

  // Find the highest age milestone that should be achieved
  const expectedMilestones = applicable.filter(m => m.ageMonth <= ageMonths);
  const achievedCount = expectedMilestones.filter(m => {
    const s = scores.find(sc => sc.milestoneId === m.id);
    return s && s.score >= 2;
  }).length;

  const achievementRate = achievedCount / expectedMilestones.length;

  // Estimate delay in months based on unachieved milestones
  const unachieved = expectedMilestones.filter(m => {
    const s = scores.find(sc => sc.milestoneId === m.id);
    return !s || s.score < 2;
  });
  const avgUnachievedAge = unachieved.length > 0
    ? unachieved.reduce((s, m) => s + m.ageMonth, 0) / unachieved.length
    : ageMonths;
  const estimatedDelay = ageMonths - avgUnachievedAge;

  if (achievementRate >= 0.8 || estimatedDelay < 2) {
    return { status: "green", label: "On Track", description: "Development progressing normally" };
  } else if (achievementRate >= 0.5 || estimatedDelay <= 6) {
    return { status: "yellow", label: "Borderline", description: `Approximately ${Math.round(estimatedDelay)} month delay detected` };
  } else {
    return { status: "red", label: "Significant Delay", description: `Approximately ${Math.round(ageMonths - avgUnachievedAge)} month delay — professional evaluation recommended` };
  }
}

// Detect regression by comparing sessions
export function detectRegression(
  sessions: MilestoneSession[],
  domain: "speech" | "motor"
): { hasRegression: boolean; details: string } {
  if (sessions.length < 2) return { hasRegression: false, details: "" };

  const sorted = [...sessions].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const prev = sorted[sorted.length - 2];
  const curr = sorted[sorted.length - 1];

  const prevPct = calculateAchievement(prev.scores, domain, prev.childAgeMonths);
  const currPct = calculateAchievement(curr.scores, domain, curr.childAgeMonths);

  if (currPct < prevPct - 5) {
    return {
      hasRegression: true,
      details: `${domain === "speech" ? "Speech & Language" : "Motor"} achievement dropped from ${prevPct}% to ${currPct}% — possible regression detected.`,
    };
  }
  return { hasRegression: false, details: "" };
}

// Generate progress data points for graphing from sessions
export function getProgressData(sessions: MilestoneSession[]): {
  speech: { age: number; percentage: number; date: string }[];
  motor: { age: number; percentage: number; date: string }[];
} {
  const sorted = [...sessions].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return {
    speech: sorted.map(s => ({
      age: s.childAgeMonths,
      percentage: calculateAchievement(s.scores, "speech", s.childAgeMonths),
      date: s.createdAt,
    })),
    motor: sorted.map(s => ({
      age: s.childAgeMonths,
      percentage: calculateAchievement(s.scores, "motor", s.childAgeMonths),
      date: s.createdAt,
    })),
  };
}

// AI insight generation (client-side heuristics)
export function generateInsights(
  scores: MilestoneScore[],
  ageMonths: number
): string[] {
  const speechPct = calculateAchievement(scores, "speech", ageMonths);
  const motorPct = calculateAchievement(scores, "motor", ageMonths);
  const insights: string[] = [];

  if (speechPct >= 80 && motorPct >= 80) {
    insights.push("Both speech and motor development are progressing well for the child's age.");
  }

  if (speechPct < motorPct - 20) {
    insights.push("Speech development appears significantly behind motor development. Focused speech-language intervention is recommended.");
  } else if (motorPct < speechPct - 20) {
    insights.push("Motor development appears behind speech development. Consider occupational or physical therapy evaluation.");
  }

  if (speechPct < 50) {
    insights.push("Speech milestones are considerably delayed. Recommend speech-language pathology assessment.");
  } else if (speechPct < 70) {
    insights.push("Speech milestones are emerging but below age expectations. Monitoring and early intervention recommended.");
  }

  if (motorPct < 50) {
    insights.push("Motor milestones show significant delay. Occupational therapy and pediatric assessment recommended.");
  } else if (motorPct < 70) {
    insights.push("Motor milestones are developing but below expectations for age. Activity-based intervention may help.");
  }

  // Check for specific domain gaps
  const speechMilestones = getMilestonesForAge(ageMonths, "speech");
  const expressiveCount = speechMilestones.filter(m => m.category === "Expressive").length;
  const expressiveAchieved = speechMilestones.filter(m => {
    if (m.category !== "Expressive") return false;
    const s = scores.find(sc => sc.milestoneId === m.id);
    return s && s.score >= 2;
  }).length;

  if (expressiveCount > 0 && expressiveAchieved / expressiveCount < 0.5) {
    insights.push("Expressive language skills appear notably delayed compared to overall development.");
  }

  if (insights.length === 0) {
    insights.push("Development is within expected range. Continue monitoring at regular intervals.");
  }

  return insights;
}

// Activity recommendations based on delays
export function getActivityRecommendations(
  scores: MilestoneScore[],
  ageMonths: number,
  domain: "speech" | "motor"
): { activity: string; target: string }[] {
  const pct = calculateAchievement(scores, domain, ageMonths);
  const activities: { activity: string; target: string }[] = [];

  if (domain === "speech") {
    if (pct < 40) {
      activities.push(
        { activity: "Sound imitation games — repeat vowels and simple syllables", target: "Vocalization" },
        { activity: "Naming objects during daily routines (bath, meals)", target: "Vocabulary" },
        { activity: "Turn-taking babble games with the child", target: "Social communication" },
        { activity: "Read picture books and point to objects", target: "Receptive language" },
      );
    } else if (pct < 70) {
      activities.push(
        { activity: "Expand child's utterances (child says 'car' → 'big red car')", target: "Sentence building" },
        { activity: "Sing action songs with gestures", target: "Expressive language" },
        { activity: "Ask simple choice questions ('milk or juice?')", target: "Communication" },
        { activity: "Play telephone or pretend conversation games", target: "Pragmatic skills" },
      );
    } else {
      activities.push(
        { activity: "Story retelling and sequencing activities", target: "Narrative skills" },
        { activity: "Rhyming and phonemic awareness games", target: "Pre-literacy" },
      );
    }
  } else {
    if (pct < 40) {
      activities.push(
        { activity: "Supervised tummy time with toys", target: "Core strength" },
        { activity: "Reaching and grasping games with soft toys", target: "Fine motor" },
        { activity: "Supported standing and bouncing", target: "Gross motor" },
        { activity: "Texture exploration (sand, water, playdough)", target: "Sensory-motor" },
      );
    } else if (pct < 70) {
      activities.push(
        { activity: "Obstacle course with pillows and tunnels", target: "Gross motor coordination" },
        { activity: "Stacking and building with blocks", target: "Fine motor precision" },
        { activity: "Ball rolling and catching games", target: "Hand-eye coordination" },
        { activity: "Simple puzzle activities", target: "Problem solving + fine motor" },
      );
    } else {
      activities.push(
        { activity: "Balance beam walking and hopping games", target: "Balance and coordination" },
        { activity: "Cutting, drawing, and tracing activities", target: "Fine motor control" },
      );
    }
  }
  return activities;
}
