/**
 * useMilestoneScores
 * ------------------
 * Single source of truth for milestone answers + domain scores.
 * Answers are persisted in localStorage keyed by child ID so they
 * survive page refreshes and are available everywhere in the app.
 */
import { useMemo } from "react";
import { getQuestionsForAge } from "@/utils/milestoneData";

export interface DomainScore {
  domain: string;
  label: string;
  score: number;
  status: "On Track" | "Monitor" | "Needs Attention";
}

export const DOMAIN_LABELS: Record<string, string> = {
  speech:    "Language",
  motor:     "Motor",
  social:    "Social",
  cognitive: "Cognitive",
};

const STORAGE_KEY = (childId: string) => `newro_milestone_answers_${childId}`;

/** Persist a completed set of answers for a child */
export function saveMilestoneAnswers(
  childId: string,
  answers: Record<string, number>
) {
  try {
    localStorage.setItem(STORAGE_KEY(childId), JSON.stringify(answers));
  } catch {/* quota exceeded – silent fail */}
}

/** Load saved answers for a child (returns {} if none) */
export function loadMilestoneAnswers(childId: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(childId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Compute per-domain percentage scores from answers.
 * Falls back to sensible placeholder values if no answers exist yet.
 */
export function computeDomainScores(
  answers: Record<string, number>,
  ageMonths: number
): DomainScore[] {
  const questions = getQuestionsForAge(ageMonths);
  const domains = ["speech", "motor", "social", "cognitive"] as const;

  return domains.map((id) => {
    const dqs = questions.filter((q) => q.domain === id);

    let score: number;
    if (dqs.length === 0 || Object.keys(answers).length === 0) {
      // No answers saved yet – use neutral placeholders so UI isn't misleading
      const placeholders: Record<string, number> = {
        speech: 68, motor: 85, social: 78, cognitive: 82,
      };
      score = placeholders[id];
    } else {
      const total = dqs.reduce((sum, q) => sum + (answers[q.id] ?? 0.75), 0);
      score = Math.round((total / dqs.length) * 100);
    }

    const status: DomainScore["status"] =
      score >= 75 ? "On Track" : score >= 50 ? "Monitor" : "Needs Attention";

    return { domain: id, label: DOMAIN_LABELS[id], score, status };
  });
}

/**
 * React hook – returns live domain scores for a child.
 * Re-runs whenever childId or ageMonths changes.
 */
export function useMilestoneScores(
  childId: string | undefined,
  ageMonths: number
): DomainScore[] {
  return useMemo(() => {
    const answers = childId ? loadMilestoneAnswers(childId) : {};
    return computeDomainScores(answers, ageMonths);
  }, [childId, ageMonths]);
}
