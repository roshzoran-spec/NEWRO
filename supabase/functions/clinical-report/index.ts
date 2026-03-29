import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? Deno.env.get("AI_API_KEY");
    const AI_MODEL = Deno.env.get("AI_MODEL") ?? "gpt-4o-mini";
    const AI_BASE_URL = (Deno.env.get("AI_BASE_URL") ?? "https://api.openai.com/v1").replace(/\/$/, "");
    if (!AI_API_KEY) throw new Error("OPENAI_API_KEY (or AI_API_KEY) is not configured");

    const { assessmentData } = await req.json();

    const systemPrompt = `You are a Senior Pediatric Clinical Neuropsychologist and Lead AI Diagnostic Specialist for the Newro platform. Your specialty is early neurodevelopmental screening for children aged 0-6 years.

Your objective is to generate an evidence-based clinical interpretation report from screening data. You MUST follow standard clinical protocols (M-CHAT-R/F, ASQ-3, DSM-5-TR, ICD-11) when interpreting scores.

## REPORT STRUCTURE (MANDATORY MARKDOWN SECTIONS):

# CLINICAL INTERPRETATION REPORT
*Confidential - For Professional Use Only*

## 1. ASSESSMENT SUMMARY
- **Patient ID/Ref:** [Reference]
- **Date of Assessment:** [Date]
- **Instrument(s) Utilized:** Newro AI Behavioral Screening (Primary), Cross-referenced with M-CHAT-R/F and ASQ-3 benchmarks.
- **Overall Concern Level:** [Risk Level]

## 2. DOMAIN-SPECIFIC ANALYSIS
Create a comparison table of domain scores:
| Domain | Score (%) | Clinical Significance |
| :--- | :--- | :--- |
| [Domain Name] | [Score] | [Interpretation: e.g. Age-Appropriate / Delayed / At-Risk] |

*Detailed Interpretation:*
Provide a professional narrative for each domain, referencing developmental milestones. Highlight specific areas where the child excels (strengths) and where deficits appear (areas for intervention).

## 3. CLINICAL CORRELATION (DSM-5-TR / ICD-11)
Correlate findings with standard diagnostic criteria:
- **Social Communication & Interaction Patterns:** [Analysis]
- **Restricted, Repetitive Behaviors (RRBs):** [Analysis]
- **Sensory & Motor Integration:** [Analysis]

## 4. PROBABILITY INDICATORS
Based on quantitative data and behavioral markers, assess the probability of developmental conditions (ASD, GDD, ADHD, Speech Delay):
- **Condition Name:** [Probability Status: Low/Moderate/High]
- **Clinical Reasoning:** Explain WHY based on the scores. Mention that this is NOT a diagnosis but a statistical risk assessment.

## 5. REHABILITATION & INTERVENTION PLAN
- **Immediate Priorities:** Top 3 therapeutic targets.
- **Recommended Therapy:** (e.g., ABA, OT, SLP) include suggested weekly frequency.
- **Home Integration:** 3 specific evidence-based activities parents should start.

## 6. FOLLOW-UP & RED FLAGS
- Timeline for re-evaluation.
- Potential specialist referrals (Neurologist, Psychiatrist, etc.).
- Immediate clinical "Red Flags" requiring urgent consultation.

---
**IMPORTANT GUIDELINES:**
- Use professional, objective medical terminology (e.g., "Pragmatic language deficit", "Stereotypic movements", "Joint attention").
- Maintain a tone of "Clinical Neutrality" — supportive but data-driven.
- DO NOT make a definitive diagnosis; use phrases like "Observations suggest", "Scores indicate clinical concern for", "Further evaluation is warranted".
- Reference specific percentage scores from the provided data.`;

    const userMessage = `Generate a clinical interpretation report for the following assessment data:

${JSON.stringify(assessmentData, null, 2)}

Please generate a comprehensive clinical report following the exact section structure specified.`;

    const response = await fetch(
      `${AI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please check your provider billing/credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("clinical-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
