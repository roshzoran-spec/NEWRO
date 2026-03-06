export type RiskLevel = "normal" | "mild" | "moderate" | "high";

export interface AssessmentQuestion {
  id: string;
  text: string;
  domain: string;
  options: { label: string; value: number }[];
  ageRange?: [number, number]; // months
}

export interface AssessmentType {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  ageRange: string;
  duration: string;
  questionCount: number;
  icon: string;
  color: string;
  iconBg: string;
  domains: string[];
}

export const assessmentTypes: AssessmentType[] = [
  {
    id: "autism",
    title: "Autism Spectrum Screening",
    shortTitle: "Autism",
    description: "Early screening inspired by M-CHAT-R/F and CARS-2 frameworks. Evaluates social communication, repetitive behaviors, and sensory responses.",
    ageRange: "16–30 months",
    duration: "10–15 min",
    questionCount: 20,
    icon: "🧩",
    color: "border-primary/30 hover:border-primary/60",
    iconBg: "bg-secondary text-primary",
    domains: ["Social Communication", "Repetitive Behaviors", "Sensory Response", "Joint Attention"],
  },
  {
    id: "speech",
    title: "Speech & Language Assessment",
    shortTitle: "Speech",
    description: "Comprehensive speech-language evaluation inspired by PLS-5 and REEL-3. Covers receptive, expressive language and articulation.",
    ageRange: "0–6 years",
    duration: "12–18 min",
    questionCount: 24,
    icon: "🗣",
    color: "border-coral/30 hover:border-coral/60",
    iconBg: "bg-coral-light text-coral",
    domains: ["Receptive Language", "Expressive Language", "Articulation", "Pragmatics"],
  },
  {
    id: "adhd",
    title: "ADHD Screening",
    shortTitle: "ADHD",
    description: "Structured screening inspired by Conners and Vanderbilt scales. Evaluates attention, hyperactivity, and impulse control.",
    ageRange: "3–6 years",
    duration: "8–12 min",
    questionCount: 18,
    icon: "⚡",
    color: "border-lavender-foreground/20 hover:border-lavender-foreground/40",
    iconBg: "bg-lavender text-lavender-foreground",
    domains: ["Inattention", "Hyperactivity", "Impulsivity", "Executive Function"],
  },
  {
    id: "developmental",
    title: "Developmental Milestones",
    shortTitle: "Development",
    description: "Age-based developmental screening inspired by Bayley and Denver scales. Covers motor, cognitive, social, and language domains.",
    ageRange: "0–6 years",
    duration: "15–20 min",
    questionCount: 25,
    icon: "📊",
    color: "border-mint-foreground/20 hover:border-mint-foreground/40",
    iconBg: "bg-mint text-mint-foreground",
    domains: ["Gross Motor", "Fine Motor", "Cognitive", "Social-Emotional", "Language"],
  },
];

// Sample questions for each assessment type
export const assessmentQuestions: Record<string, AssessmentQuestion[]> = {
  autism: [
    { id: "a1", text: "Does your child look at you when you call their name?", domain: "Joint Attention", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a2", text: "Does your child make eye contact with you during interactions?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a3", text: "Does your child point to objects to show you something interesting?", domain: "Joint Attention", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a4", text: "Does your child imitate your actions (e.g., clapping, waving)?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a5", text: "Does your child show interest in other children?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a6", text: "Does your child engage in pretend play (e.g., feeding a doll)?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a7", text: "Does your child line up toys or objects repeatedly?", domain: "Repetitive Behaviors", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a8", text: "Does your child get upset by minor changes in routine?", domain: "Repetitive Behaviors", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a9", text: "Does your child have unusual reactions to sounds (covering ears, ignoring)?", domain: "Sensory Response", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a10", text: "Does your child have unusual reactions to textures or touch?", domain: "Sensory Response", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a11", text: "Does your child repeat words or phrases they have heard (echolalia)?", domain: "Repetitive Behaviors", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a12", text: "Does your child respond to your emotions (e.g., comfort you when sad)?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a13", text: "Does your child use gestures to communicate (waving, nodding)?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a14", text: "Does your child have an unusual fascination with spinning objects?", domain: "Repetitive Behaviors", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a15", text: "Does your child share enjoyment with you (e.g., showing a toy)?", domain: "Joint Attention", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a16", text: "Does your child follow your gaze when you look at something?", domain: "Joint Attention", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "a17", text: "Does your child engage in hand flapping or body rocking?", domain: "Repetitive Behaviors", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a18", text: "Does your child seem oversensitive or undersensitive to pain?", domain: "Sensory Response", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a19", text: "Does your child have difficulty with changes in environment or new places?", domain: "Repetitive Behaviors", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "a20", text: "Does your child respond to simple instructions (e.g., 'come here')?", domain: "Social Communication", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
  ],
  speech: [
    { id: "s1", text: "Does your child turn toward sounds or voices?", domain: "Receptive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s2", text: "Does your child understand simple words like 'no' or 'bye-bye'?", domain: "Receptive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s3", text: "Can your child follow one-step instructions (e.g., 'Give me the ball')?", domain: "Receptive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s4", text: "Does your child understand questions like 'Where is your shoe?'", domain: "Receptive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s5", text: "Can your child follow two-step instructions?", domain: "Receptive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s6", text: "Does your child babble or make speech-like sounds?", domain: "Expressive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s7", text: "Does your child say at least 5 recognizable words?", domain: "Expressive Language", options: [{ label: "Yes, more than 5", value: 0 }, { label: "About 3–5 words", value: 1 }, { label: "1–2 words", value: 2 }, { label: "No words yet", value: 3 }] },
    { id: "s8", text: "Can your child combine two words (e.g., 'more milk')?", domain: "Expressive Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "s9", text: "Does your child use sentences of 3 or more words?", domain: "Expressive Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "s10", text: "Can your child tell a simple story or describe events?", domain: "Expressive Language", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "s11", text: "Is your child's speech understandable to family members?", domain: "Articulation", options: [{ label: "Mostly clear", value: 0 }, { label: "About half", value: 1 }, { label: "Difficult to understand", value: 2 }, { label: "Very unclear", value: 3 }] },
    { id: "s12", text: "Is your child's speech understandable to strangers?", domain: "Articulation", options: [{ label: "Mostly clear", value: 0 }, { label: "About half", value: 1 }, { label: "Difficult to understand", value: 2 }, { label: "Very unclear", value: 3 }] },
    { id: "s13", text: "Does your child substitute sounds in words (e.g., 'wabbit' for 'rabbit')?", domain: "Articulation", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Always", value: 3 }] },
    { id: "s14", text: "Does your child have difficulty producing certain sounds?", domain: "Articulation", options: [{ label: "No difficulty", value: 0 }, { label: "A few sounds", value: 1 }, { label: "Several sounds", value: 2 }, { label: "Many sounds", value: 3 }] },
    { id: "s15", text: "Does your child stutter or repeat sounds/words?", domain: "Articulation", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Frequently", value: 3 }] },
    { id: "s16", text: "Does your child take turns in conversation?", domain: "Pragmatics", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s17", text: "Does your child use language to request things?", domain: "Pragmatics", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s18", text: "Does your child greet people appropriately?", domain: "Pragmatics", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s19", text: "Does your child maintain a topic during conversation?", domain: "Pragmatics", options: [{ label: "Usually", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s20", text: "Does your child use language for different purposes (asking, telling, pretending)?", domain: "Pragmatics", options: [{ label: "Yes, varied", value: 0 }, { label: "Somewhat", value: 1 }, { label: "Limited", value: 2 }, { label: "Very limited", value: 3 }] },
    { id: "s21", text: "Does your child respond to their name?", domain: "Receptive Language", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s22", text: "Does your child use gestures alongside speech?", domain: "Expressive Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "s23", text: "Does your child ask questions using 'what', 'where', 'why'?", domain: "Expressive Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "s24", text: "Does your child enjoy being read to or looking at books?", domain: "Receptive Language", options: [{ label: "Very much", value: 0 }, { label: "Somewhat", value: 1 }, { label: "Not much", value: 2 }, { label: "Not at all", value: 3 }] },
  ],
  adhd: [
    { id: "h1", text: "Does your child have difficulty sustaining attention during tasks or play?", domain: "Inattention", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h2", text: "Does your child seem not to listen when spoken to directly?", domain: "Inattention", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h3", text: "Does your child have difficulty following through on instructions?", domain: "Inattention", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h4", text: "Does your child lose things needed for tasks and activities?", domain: "Inattention", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h5", text: "Is your child easily distracted by unrelated stimuli?", domain: "Inattention", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h6", text: "Does your child fidget with hands or feet or squirm in seat?", domain: "Hyperactivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h7", text: "Does your child leave seat when remaining seated is expected?", domain: "Hyperactivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h8", text: "Does your child run or climb excessively in inappropriate situations?", domain: "Hyperactivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h9", text: "Does your child talk excessively?", domain: "Hyperactivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h10", text: "Does your child have difficulty playing quietly?", domain: "Hyperactivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h11", text: "Does your child blurt out answers before questions are completed?", domain: "Impulsivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h12", text: "Does your child have difficulty waiting their turn?", domain: "Impulsivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h13", text: "Does your child interrupt or intrude on others?", domain: "Impulsivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h14", text: "Does your child act without thinking about consequences?", domain: "Impulsivity", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h15", text: "Does your child have difficulty organizing tasks and activities?", domain: "Executive Function", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h16", text: "Does your child have difficulty remembering daily activities?", domain: "Executive Function", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h17", text: "Does your child have difficulty transitioning between activities?", domain: "Executive Function", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
    { id: "h18", text: "Does your child have difficulty controlling emotions (tantrums, outbursts)?", domain: "Executive Function", options: [{ label: "Never", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Often", value: 2 }, { label: "Very often", value: 3 }] },
  ],
  developmental: [
    { id: "d1", text: "Can your child hold their head steady when held upright?", domain: "Gross Motor", options: [{ label: "Yes, easily", value: 0 }, { label: "With some effort", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d2", text: "Can your child sit without support?", domain: "Gross Motor", options: [{ label: "Yes, easily", value: 0 }, { label: "For short periods", value: 1 }, { label: "With support only", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d3", text: "Can your child walk independently?", domain: "Gross Motor", options: [{ label: "Yes, steadily", value: 0 }, { label: "A few steps", value: 1 }, { label: "Cruising only", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d4", text: "Can your child run without frequently falling?", domain: "Gross Motor", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d5", text: "Can your child jump with both feet off the ground?", domain: "Gross Motor", options: [{ label: "Yes", value: 0 }, { label: "Tries to", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d6", text: "Can your child grasp objects with their hand?", domain: "Fine Motor", options: [{ label: "Yes, easily", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d7", text: "Can your child pick up small objects using pincer grasp (thumb and finger)?", domain: "Fine Motor", options: [{ label: "Yes", value: 0 }, { label: "Tries to", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d8", text: "Can your child scribble with a crayon?", domain: "Fine Motor", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With help", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d9", text: "Can your child stack at least 3 blocks?", domain: "Fine Motor", options: [{ label: "Yes, more", value: 0 }, { label: "2–3 blocks", value: 1 }, { label: "1 block", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d10", text: "Can your child draw a recognizable shape (circle, line)?", domain: "Fine Motor", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d11", text: "Does your child explore objects by shaking, banging, or mouthing?", domain: "Cognitive", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "d12", text: "Does your child look for hidden objects (object permanence)?", domain: "Cognitive", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d13", text: "Can your child sort objects by shape or color?", domain: "Cognitive", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With help", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d14", text: "Does your child engage in pretend play?", domain: "Cognitive", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d15", text: "Can your child understand cause and effect (e.g., press button → music)?", domain: "Cognitive", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d16", text: "Does your child smile socially at familiar people?", domain: "Social-Emotional", options: [{ label: "Always", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "d17", text: "Does your child show stranger anxiety (appropriate wariness)?", domain: "Social-Emotional", options: [{ label: "Age-appropriate", value: 0 }, { label: "Mild", value: 1 }, { label: "Excessive or none", value: 2 }, { label: "Concerning pattern", value: 3 }] },
    { id: "d18", text: "Does your child show affection to caregivers?", domain: "Social-Emotional", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "d19", text: "Does your child play cooperatively with other children?", domain: "Social-Emotional", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Parallel play only", value: 3 }] },
    { id: "d20", text: "Can your child express emotions appropriately for their age?", domain: "Social-Emotional", options: [{ label: "Yes", value: 0 }, { label: "Somewhat", value: 1 }, { label: "With difficulty", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d21", text: "Does your child coo or vocalize?", domain: "Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Never", value: 3 }] },
    { id: "d22", text: "Does your child babble with consonant sounds (ba, da, ma)?", domain: "Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d23", text: "Does your child use words to communicate?", domain: "Language", options: [{ label: "Many words", value: 0 }, { label: "Some words", value: 1 }, { label: "A few", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d24", text: "Can your child name common objects?", domain: "Language", options: [{ label: "Many", value: 0 }, { label: "Some", value: 1 }, { label: "A few", value: 2 }, { label: "Not yet", value: 3 }] },
    { id: "d25", text: "Can your child use sentences to express needs?", domain: "Language", options: [{ label: "Often", value: 0 }, { label: "Sometimes", value: 1 }, { label: "Rarely", value: 2 }, { label: "Not yet", value: 3 }] },
  ],
};

export function calculateResults(assessmentId: string, answers: Record<string, number>) {
  const questions = assessmentQuestions[assessmentId];
  const assessment = assessmentTypes.find((a) => a.id === assessmentId)!;
  if (!questions) return null;

  const maxScore = questions.length * 3;
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const percentage = (totalScore / maxScore) * 100;

  // Domain scores
  const domainScores: Record<string, { score: number; max: number; percentage: number }> = {};
  for (const q of questions) {
    if (!domainScores[q.domain]) domainScores[q.domain] = { score: 0, max: 0, percentage: 0 };
    domainScores[q.domain].score += answers[q.id] ?? 0;
    domainScores[q.domain].max += 3;
  }
  for (const d of Object.keys(domainScores)) {
    domainScores[d].percentage = (domainScores[d].score / domainScores[d].max) * 100;
  }

  let risk: RiskLevel;
  if (percentage <= 15) risk = "normal";
  else if (percentage <= 35) risk = "mild";
  else if (percentage <= 60) risk = "moderate";
  else risk = "high";

  const riskLabels: Record<RiskLevel, string> = {
    normal: "Normal Development",
    mild: "Mild Concern",
    moderate: "Moderate Concern",
    high: "High Risk – Evaluation Recommended",
  };

  const recommendations: Record<RiskLevel, string[]> = {
    normal: [
      "Continue monitoring developmental milestones",
      "Engage in age-appropriate play and learning activities",
      "Schedule routine well-child visits",
    ],
    mild: [
      "Monitor closely over the next 3 months",
      "Increase enrichment activities at home",
      "Consider follow-up screening in 3 months",
      "Discuss observations with your pediatrician",
    ],
    moderate: [
      "Schedule a comprehensive evaluation with a specialist",
      "Begin early intervention activities at home",
      "Consider therapy consultation",
      "Re-screen in 4–6 weeks",
      "Document specific concerns for the specialist visit",
    ],
    high: [
      "Seek immediate professional evaluation",
      "Contact an early intervention program",
      "Schedule comprehensive developmental assessment",
      "Begin recommended therapy as soon as possible",
      "Connect with support groups and resources",
    ],
  };

  return {
    assessmentId,
    assessmentTitle: assessment.title,
    totalScore,
    maxScore,
    percentage: Math.round(percentage),
    risk,
    riskLabel: riskLabels[risk],
    domainScores,
    recommendations: recommendations[risk],
    completedAt: new Date().toISOString(),
  };
}
