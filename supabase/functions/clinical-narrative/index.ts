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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { examType, findings, parameters } = await req.json();

    const examNames: Record<string, string> = {
      behavioral: "Behavioral Observation",
      "oro-motor": "Oro-Motor Examination",
      "cranial-nerve": "Cranial Nerve Examination",
    };

    const systemPrompt = `You are a senior pediatric speech-language pathologist and clinical specialist writing professional examination narratives for the Newro neurodevelopment platform.

You will receive structured examination findings (parameter name, finding level, and optional notes) from a ${examNames[examType] || examType}.

Generate a professional clinical narrative that:
1. Opens with a brief statement about the examination conducted
2. Groups findings by category/system
3. Uses precise clinical terminology
4. Describes normal findings briefly and abnormal findings in detail
5. Notes clinical significance of reduced/absent findings
6. Ends with a brief clinical impression summarizing key concerns

Finding levels:
- Normal = within functional limits
- Inconsistent = variable/emerging ability
- Reduced = below functional expectations
- Absent = not observed/not functional

RULES:
- Write in third person past tense ("The child demonstrated...")
- Be concise but clinically thorough
- Highlight concerns that warrant intervention
- Use professional medical report language
- Generate ONLY the narrative paragraph(s), no headers or bullet points for the main body
- End with a "Clinical Impression:" summary line`;

    const findingsSummary = findings.map((f: any) => {
      const param = parameters.find((p: any) => p.id === f.parameterId);
      return `${param?.label || f.parameterId}: ${f.finding}${f.notes ? ` (Note: ${f.notes})` : ""}`;
    }).join("\n");

    const userMessage = `Generate a clinical narrative for the following ${examNames[examType] || examType} findings:\n\n${findingsSummary}`;

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
          { role: "user", content: userMessage },
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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings." }), {
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
    console.error("clinical-narrative error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
