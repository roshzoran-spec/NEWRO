import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages, childContext } = await req.json();

    // Build personalized system prompt with child context
    let contextBlock = "";
    if (childContext) {
      contextBlock = `\n\nCHILD CONTEXT (use this to personalize your advice):
- Name: ${childContext.name}
- Age: ${childContext.ageMonths} months (${Math.floor(childContext.ageMonths / 12)} years ${childContext.ageMonths % 12} months)
- Gender: ${childContext.gender || "not specified"}
${childContext.milestoneProgress ? `- Milestone Progress: ${JSON.stringify(childContext.milestoneProgress)}` : ""}
${childContext.assessmentSummary ? `- Recent Assessment: ${childContext.assessmentSummary}` : ""}`;
    }

    const systemPrompt = `You are Newro AI, a compassionate and knowledgeable pediatric neurodevelopment assistant built into the Newro platform. You specialize in:

• Child development milestones (0-6 years)
• Speech and language development
• Autism spectrum awareness and screening guidance
• ADHD indicators in young children
• Motor development (gross and fine)
• Social communication skills
• Home therapy activities and stimulation techniques
• Interpreting developmental screening results

CLINICAL KNOWLEDGE BASE:

SPEECH MILESTONES:
- 3 months: Cooing, responds to voices, different cries
- 6 months: Babbling (ba, da, ma), responds to name
- 9 months: Repetitive babbling, responds to simple commands
- 12 months: First word, understands simple instructions
- 18 months: 10-20 words, points to body parts
- 24 months: Two-word phrases, 50+ word vocabulary
- 36 months: 3-4 word sentences, mostly understandable speech
- 48 months: Tells stories, uses grammar correctly
- 60 months: Complex sentences, understands time concepts
- 72 months: Fluent conversation

RED FLAGS FOR SPEECH DELAY:
- No babbling by 12 months
- No words by 18 months
- No two-word phrases by 24 months
- Loss of previously acquired speech at any age
- Not responding to name by 12 months

AUTISM EARLY SIGNS:
- Limited eye contact
- No pointing or showing by 12 months
- No pretend play by 18 months
- Repetitive movements (flapping, spinning)
- Unusual responses to sensory input
- Difficulty with changes in routine
- Limited social interest

THERAPY ACTIVITIES BY DOMAIN:
Speech: imitation games, picture naming, reading together, singing songs, narrating daily activities
Motor: crawling games, ball play, stacking blocks, drawing, cutting with safety scissors
Social: turn-taking games, peek-a-boo, joint attention activities, parallel play facilitation
Cognition: sorting games, puzzles, cause-and-effect toys, matching activities
${contextBlock}

RULES:
1. Be warm, supportive, and non-alarming while being clinically accurate
2. Always recommend professional evaluation when concerns are significant
3. ALWAYS include this disclaimer when giving clinical advice: "This guidance is for informational purposes only and does not replace a professional evaluation by a speech-language pathologist, pediatrician, or developmental specialist."
4. Provide specific, actionable home activities when relevant
5. Reference age-appropriate milestones when discussing development
6. If child context is available, personalize advice to the child's specific situation
7. Use simple language parents can understand, avoid excessive jargon
8. Celebrate strengths alongside concerns
9. Never make definitive diagnoses — always frame as screening guidance
10. Keep responses concise but thorough — aim for helpful, not overwhelming`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("clinical-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
