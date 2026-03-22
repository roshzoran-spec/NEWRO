import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface MilestoneMaster {
  id: string;
  domain: "speech" | "cognition" | "motor" | "social";
  category: string;
  age_month: number;
  description: string;
  question: string;
  priority: string;
  difficulty: string;
}

export interface ChildProgress {
  id: string;
  child_id: string;
  milestone_id: string;
  response: "yes" | "emerging" | "not_yet";
  date_updated: string;
}

export type ResponseValue = "yes" | "emerging" | "not_yet";

const responseScore: Record<ResponseValue, number> = { yes: 2, emerging: 1, not_yet: 0 };

export function useMilestones(childId: string | null, ageMonths: number) {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<MilestoneMaster[]>([]);
  const [progress, setProgress] = useState<ChildProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch milestones for age
  useEffect(() => {
    const fetchMilestones = async () => {
      const { data } = await supabase
        .from("milestone_master")
        .select("*")
        .lte("age_month", ageMonths)
        .order("age_month", { ascending: true })
        .order("domain", { ascending: true });
      if (data) setMilestones(data as unknown as MilestoneMaster[]);
    };
    fetchMilestones();
  }, [ageMonths]);

  // Fetch child progress
  useEffect(() => {
    if (!childId || !user) { setProgress([]); setLoading(false); return; }
    const fetchProgress = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("child_progress")
        .select("*")
        .eq("child_id", childId);
      if (data) setProgress(data as unknown as ChildProgress[]);
      setLoading(false);
    };
    fetchProgress();
  }, [childId, user]);

  const saveResponse = useCallback(async (milestoneId: string, response: ResponseValue) => {
    if (!childId || !user) return;
    setSaving(true);

    // Optimistic update
    setProgress(prev => {
      const existing = prev.findIndex(p => p.milestone_id === milestoneId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], response, date_updated: new Date().toISOString() };
        return next;
      }
      return [...prev, { id: crypto.randomUUID(), child_id: childId, milestone_id: milestoneId, response, date_updated: new Date().toISOString() }];
    });

    const { error } = await supabase.from("child_progress").upsert({
      child_id: childId,
      user_id: user.id,
      milestone_id: milestoneId,
      response,
      date_updated: new Date().toISOString(),
    }, { onConflict: "child_id,milestone_id" });

    if (error) console.error("Save progress error:", error);
    setSaving(false);
  }, [childId, user]);

  // Domain stats
  const getDomainStats = useCallback((domain: string) => {
    const domainMilestones = milestones.filter(m => m.domain === domain);
    if (domainMilestones.length === 0) return { total: 0, achieved: 0, emerging: 0, notYet: 0, percentage: 0 };
    
    let achieved = 0, emerging = 0, notYet = 0;
    domainMilestones.forEach(m => {
      const p = progress.find(pr => pr.milestone_id === m.id);
      if (p?.response === "yes") achieved++;
      else if (p?.response === "emerging") emerging++;
      else notYet++;
    });

    const maxScore = domainMilestones.length * 2;
    const totalScore = (achieved * 2) + (emerging * 1);
    return { total: domainMilestones.length, achieved, emerging, notYet, percentage: Math.round((totalScore / maxScore) * 100) };
  }, [milestones, progress]);

  // Delay detection
  const getDelayStatus = useCallback((domain: string): { status: "green" | "yellow" | "red"; label: string; detail: string } => {
    const stats = getDomainStats(domain);
    if (stats.total === 0) return { status: "green", label: "On Track", detail: "No milestones expected yet" };
    
    if (stats.percentage >= 75) return { status: "green", label: "On Track", detail: "Development progressing normally" };
    if (stats.percentage >= 50) return { status: "yellow", label: "Borderline", detail: "Some milestones emerging — monitor closely" };
    return { status: "red", label: "Significant Delay", detail: "Professional evaluation recommended" };
  }, [getDomainStats]);

  // Get milestones grouped by age for a domain
  const getMilestonesByAge = useCallback((domain: string) => {
    const domainMs = milestones.filter(m => m.domain === domain);
    const grouped: Record<number, MilestoneMaster[]> = {};
    domainMs.forEach(m => {
      if (!grouped[m.age_month]) grouped[m.age_month] = [];
      grouped[m.age_month].push(m);
    });
    return grouped;
  }, [milestones]);

  const getResponse = useCallback((milestoneId: string): ResponseValue => {
    return progress.find(p => p.milestone_id === milestoneId)?.response || "not_yet";
  }, [progress]);

  // Check if update is due (15-day cycle)
  const getNextUpdateDate = useCallback(() => {
    if (progress.length === 0) return null;
    const latestUpdate = progress.reduce((latest, p) => {
      const d = new Date(p.date_updated).getTime();
      return d > latest ? d : latest;
    }, 0);
    const nextDue = new Date(latestUpdate + 15 * 24 * 60 * 60 * 1000);
    return nextDue;
  }, [progress]);

  const isUpdateDue = useCallback(() => {
    const next = getNextUpdateDate();
    if (!next) return true; // Never updated
    return new Date() >= next;
  }, [getNextUpdateDate]);

  return {
    milestones, progress, loading, saving,
    saveResponse, getDomainStats, getDelayStatus,
    getMilestonesByAge, getResponse,
    getNextUpdateDate, isUpdateDue,
    responseScore,
  };
}
