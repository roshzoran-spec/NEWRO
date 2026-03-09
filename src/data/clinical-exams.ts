// Clinical Examination Data — Behavioral Observation & Oro-Motor

export type Finding = "normal" | "inconsistent" | "reduced" | "absent";

export interface ExamParameter {
  id: string;
  label: string;
  description: string;
  category: string;
}

export interface ExamFinding {
  parameterId: string;
  finding: Finding;
  notes?: string;
}

export const findingLabels: Record<Finding, { label: string; color: string; severity: number }> = {
  normal: { label: "Normal", color: "bg-emerald-100 text-emerald-700 border-emerald-300", severity: 0 },
  inconsistent: { label: "Inconsistent", color: "bg-yellow-100 text-yellow-700 border-yellow-300", severity: 1 },
  reduced: { label: "Reduced", color: "bg-orange-100 text-orange-700 border-orange-300", severity: 2 },
  absent: { label: "Absent", color: "bg-red-100 text-red-700 border-red-300", severity: 3 },
};

// ========== BEHAVIORAL OBSERVATION ==========
export const behavioralParameters: ExamParameter[] = [
  // Social Communication
  { id: "bo-01", label: "Eye Contact", description: "Frequency and quality of eye contact during interaction", category: "Social Communication" },
  { id: "bo-02", label: "Joint Attention", description: "Ability to share focus on an object/event with another person", category: "Social Communication" },
  { id: "bo-03", label: "Response to Name", description: "Consistency of turning when name is called", category: "Social Communication" },
  { id: "bo-04", label: "Social Smile", description: "Presence of reciprocal smiling in social context", category: "Social Communication" },
  { id: "bo-05", label: "Social Referencing", description: "Looking to caregiver for emotional cues in new situations", category: "Social Communication" },
  { id: "bo-06", label: "Shared Enjoyment", description: "Sharing pleasure or excitement with others", category: "Social Communication" },
  // Play & Imitation
  { id: "bo-07", label: "Functional Play", description: "Age-appropriate use of toys (e.g., pushing car, feeding doll)", category: "Play & Imitation" },
  { id: "bo-08", label: "Symbolic Play", description: "Pretend play using objects as substitutes", category: "Play & Imitation" },
  { id: "bo-09", label: "Imitation of Actions", description: "Ability to copy motor actions demonstrated by examiner", category: "Play & Imitation" },
  { id: "bo-10", label: "Imitation of Sounds", description: "Ability to repeat sounds or words", category: "Play & Imitation" },
  { id: "bo-11", label: "Turn-Taking", description: "Ability to take turns during play or conversation", category: "Play & Imitation" },
  // Sensory & Behavior
  { id: "bo-12", label: "Sensory Seeking", description: "Unusual seeking of sensory input (spinning, mouthing)", category: "Sensory & Behavior" },
  { id: "bo-13", label: "Sensory Avoidance", description: "Negative reaction to certain textures, sounds, or lights", category: "Sensory & Behavior" },
  { id: "bo-14", label: "Stereotypic Behaviors", description: "Hand flapping, body rocking, toe walking", category: "Sensory & Behavior" },
  { id: "bo-15", label: "Restricted Interests", description: "Fixation on specific objects or topics", category: "Sensory & Behavior" },
  { id: "bo-16", label: "Transition Tolerance", description: "Ability to cope with changes in activity or routine", category: "Sensory & Behavior" },
  // Attention & Regulation
  { id: "bo-17", label: "Attention Span", description: "Duration of sustained attention during structured tasks", category: "Attention & Regulation" },
  { id: "bo-18", label: "Emotional Regulation", description: "Ability to manage frustration and emotional responses", category: "Attention & Regulation" },
  { id: "bo-19", label: "Activity Level", description: "Appropriateness of activity level for the setting", category: "Attention & Regulation" },
  { id: "bo-20", label: "Compliance", description: "Willingness to follow instructions and cooperate", category: "Attention & Regulation" },
];

// ========== ORO-MOTOR EXAMINATION ==========
export const oroMotorParameters: ExamParameter[] = [
  // Lip Function
  { id: "om-01", label: "Lip Closure at Rest", description: "Maintenance of lip seal when not speaking or eating", category: "Lip Function" },
  { id: "om-02", label: "Lip Rounding", description: "Ability to round lips (e.g., for /o/, /u/ sounds or whistling)", category: "Lip Function" },
  { id: "om-03", label: "Lip Retraction", description: "Ability to spread lips (e.g., smiling, /i/ sound)", category: "Lip Function" },
  { id: "om-04", label: "Lip Strength", description: "Resistance against pulling during lip closure", category: "Lip Function" },
  // Tongue Function
  { id: "om-05", label: "Tongue Protrusion", description: "Ability to extend tongue beyond lips at midline", category: "Tongue Function" },
  { id: "om-06", label: "Tongue Elevation", description: "Ability to lift tongue tip to alveolar ridge", category: "Tongue Function" },
  { id: "om-07", label: "Tongue Lateralization", description: "Ability to move tongue side to side", category: "Tongue Function" },
  { id: "om-08", label: "Tongue Retraction", description: "Ability to pull tongue back into oral cavity", category: "Tongue Function" },
  { id: "om-09", label: "Tongue Strength", description: "Resistance when pushing against cheek/tongue depressor", category: "Tongue Function" },
  // Jaw Function
  { id: "om-10", label: "Jaw Stability", description: "Control and stability during jaw opening/closing", category: "Jaw Function" },
  { id: "om-11", label: "Jaw Grading", description: "Controlled range of jaw movement", category: "Jaw Function" },
  { id: "om-12", label: "Jaw Strength", description: "Bite strength and chewing efficiency", category: "Jaw Function" },
  // Palatal Function
  { id: "om-13", label: "Palatal Movement", description: "Soft palate elevation during phonation (say 'ah')", category: "Palatal Function" },
  { id: "om-14", label: "Gag Reflex", description: "Presence and symmetry of gag reflex", category: "Palatal Function" },
  { id: "om-15", label: "Nasal Emission", description: "Presence of nasal air escape during speech", category: "Palatal Function" },
  // Feeding & Swallowing
  { id: "om-16", label: "Drooling", description: "Presence and severity of drooling", category: "Feeding & Swallowing" },
  { id: "om-17", label: "Chewing Pattern", description: "Rotary vs munching pattern during solid food intake", category: "Feeding & Swallowing" },
  { id: "om-18", label: "Swallowing Coordination", description: "Efficiency and timing of swallow reflex", category: "Feeding & Swallowing" },
  { id: "om-19", label: "Cup Drinking", description: "Ability to drink from open cup without excessive spillage", category: "Feeding & Swallowing" },
  { id: "om-20", label: "Straw Drinking", description: "Ability to generate suction for straw use", category: "Feeding & Swallowing" },
];

// ========== CRANIAL NERVE EXAMINATION ==========
export const cranialNerveParameters: ExamParameter[] = [
  // CN V - Trigeminal
  { id: "cn-01", label: "Jaw Clench (CN V)", description: "Strength of jaw closure — masseter and temporalis function", category: "Trigeminal (CN V)" },
  { id: "cn-02", label: "Lateral Jaw Movement (CN V)", description: "Ability to move jaw side to side against resistance", category: "Trigeminal (CN V)" },
  { id: "cn-03", label: "Facial Sensation (CN V)", description: "Response to light touch on face (forehead, cheek, chin)", category: "Trigeminal (CN V)" },
  // CN VII - Facial
  { id: "cn-04", label: "Facial Symmetry (CN VII)", description: "Symmetry of face at rest and during movement", category: "Facial (CN VII)" },
  { id: "cn-05", label: "Forehead Wrinkling (CN VII)", description: "Ability to raise eyebrows symmetrically", category: "Facial (CN VII)" },
  { id: "cn-06", label: "Eye Closure (CN VII)", description: "Tight closure of eyes against resistance", category: "Facial (CN VII)" },
  { id: "cn-07", label: "Smile Symmetry (CN VII)", description: "Equal retraction of lips on both sides", category: "Facial (CN VII)" },
  { id: "cn-08", label: "Lip Pucker (CN VII)", description: "Ability to purse lips for /u/ or whistling", category: "Facial (CN VII)" },
  // CN IX - Glossopharyngeal
  { id: "cn-09", label: "Gag Reflex (CN IX)", description: "Presence and symmetry of pharyngeal reflex", category: "Glossopharyngeal (CN IX)" },
  { id: "cn-10", label: "Pharyngeal Sensation (CN IX)", description: "Sensation in posterior tongue and pharynx", category: "Glossopharyngeal (CN IX)" },
  // CN X - Vagus
  { id: "cn-11", label: "Palatal Elevation (CN X)", description: "Symmetrical lift of soft palate on phonation", category: "Vagus (CN X)" },
  { id: "cn-12", label: "Vocal Quality (CN X)", description: "Presence of breathiness, hoarseness, or wet vocal quality", category: "Vagus (CN X)" },
  { id: "cn-13", label: "Cough Reflex (CN X)", description: "Strength and effectiveness of voluntary cough", category: "Vagus (CN X)" },
  // CN XII - Hypoglossal
  { id: "cn-14", label: "Tongue Protrusion (CN XII)", description: "Midline protrusion without deviation", category: "Hypoglossal (CN XII)" },
  { id: "cn-15", label: "Tongue Strength (CN XII)", description: "Resistance against lateral push", category: "Hypoglossal (CN XII)" },
  { id: "cn-16", label: "Tongue Speed (CN XII)", description: "Rapid alternating tongue movements (diadochokinesis)", category: "Hypoglossal (CN XII)" },
];

// Get summary stats from findings
export function getExamSummary(findings: ExamFinding[], parameters: ExamParameter[]) {
  const total = parameters.length;
  const scored = findings.length;
  const normal = findings.filter(f => f.finding === "normal").length;
  const inconsistent = findings.filter(f => f.finding === "inconsistent").length;
  const reduced = findings.filter(f => f.finding === "reduced").length;
  const absent = findings.filter(f => f.finding === "absent").length;
  const severityScore = findings.reduce((sum, f) => sum + findingLabels[f.finding].severity, 0);
  const maxSeverity = scored * 3;
  const normalPct = scored > 0 ? Math.round((normal / scored) * 100) : 0;

  return { total, scored, normal, inconsistent, reduced, absent, severityScore, maxSeverity, normalPct };
}
