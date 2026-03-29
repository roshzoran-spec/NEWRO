import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeHelp,
  Brain,
  FileBadge2,
  FileSearch,
  HeartHandshake,
  Microscope,
  NotebookPen,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
} from "lucide-react";

export interface MarketingPageConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: {
    label: string;
    to: string;
  };
  secondaryCta?: {
    label: string;
    to: string;
  };
  highlights: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
  }>;
  sections: Array<{
    title: string;
    body: string;
  }>;
}

export const marketingPages: Record<string, MarketingPageConfig> = {
  screening: {
    eyebrow: "Guided Screening",
    title: "Development screening that stays clinically grounded",
    description:
      "Start with focused AI-supported screeners that cover the right developmental domains without overwhelming parents with unnecessarily long questionnaires.",
    primaryCta: { label: "Start AI Screening", to: "/assessments" },
    secondaryCta: { label: "Add New Patient", to: "/intake" },
    highlights: [
      {
        title: "Shorter question flows",
        description: "Condensed assessments keep families engaged while preserving balanced coverage across key domains.",
        icon: FileSearch,
      },
      {
        title: "Evidence-inspired structure",
        description: "Each pathway is modeled on familiar pediatric screening patterns and produces actionable summaries.",
        icon: Microscope,
      },
      {
        title: "Clear next steps",
        description: "Reports translate concern levels into monitoring, referral, and therapy recommendations.",
        icon: NotebookPen,
      },
    ],
    sections: [
      {
        title: "What families experience",
        body:
          "Parents move through one question at a time with progress visibility, domain-aware prompts, and fast completion times that reduce drop-off.",
      },
      {
        title: "What clinicians keep",
        body:
          "The scoring model still reflects the selected domains, so results remain interpretable and useful for triage, follow-up, and planning.",
      },
    ],
  },
  therapy: {
    eyebrow: "Therapy Planning",
    title: "Therapy plans built around the child, not generic templates",
    description:
      "Turn screening findings into targeted home programs and clinician-guided intervention plans for speech, behavior, sensory, and developmental support.",
    primaryCta: { label: "Create an Account", to: "/signup" },
    secondaryCta: { label: "View Assessments", to: "/assessments" },
    highlights: [
      {
        title: "Plan by domain",
        description: "Speech, motor, behavior, and regulation strategies are grouped by the areas that need support most.",
        icon: Activity,
      },
      {
        title: "Home + clinic alignment",
        description: "Families and therapists can work from the same goals, routines, and recommended follow-ups.",
        icon: HeartHandshake,
      },
      {
        title: "Progress-informed updates",
        description: "Therapy recommendations can evolve as milestone performance and new screening data come in.",
        icon: Sparkles,
      },
    ],
    sections: [
      {
        title: "For parents",
        body:
          "Use therapy plans to organize daily practice into manageable routines with clear goals and realistic expectations.",
      },
      {
        title: "For therapists",
        body:
          "Use structured findings to prioritize intervention targets, communicate with families, and document plan rationale more efficiently.",
      },
    ],
  },
  "milestones-info": {
    eyebrow: "Milestone Tracking",
    title: "Track development over time, not just at a single visit",
    description:
      "Follow speech, motor, and broader developmental progress with a milestone view that helps families notice gains, plateaus, and regressions earlier.",
    primaryCta: { label: "Open Milestone Tracker", to: "/milestones" },
    secondaryCta: { label: "Create an Account", to: "/signup" },
    highlights: [
      {
        title: "Age-aware progress",
        description: "Track what is emerging now and what should be monitored next based on developmental timing.",
        icon: Brain,
      },
      {
        title: "Trend visibility",
        description: "See progress patterns over time instead of relying only on memory during appointments.",
        icon: Activity,
      },
      {
        title: "Shared language",
        description: "Parents and clinicians can discuss the same milestones using a common frame of reference.",
        icon: Stethoscope,
      },
    ],
    sections: [
      {
        title: "Why it matters",
        body:
          "Milestone tracking is most helpful when it highlights both strengths and areas to watch, giving teams a better basis for follow-up decisions.",
      },
      {
        title: "Who it helps",
        body:
          "Families gain clarity between visits, while professionals get a cleaner view of change over time and therapy response.",
      },
    ],
  },
  consultation: {
    eyebrow: "Clinical Consultation",
    title: "Move from screening to professional guidance with less friction",
    description:
      "Consultation pathways help families prepare for specialist conversations and give providers better context before the first appointment.",
    primaryCta: { label: "Book a Demo", to: "/book-demo" },
    secondaryCta: { label: "Sign Up", to: "/signup" },
    highlights: [
      {
        title: "Better intake quality",
        description: "Screening summaries, developmental history, and milestone patterns can be reviewed before the visit.",
        icon: FileBadge2,
      },
      {
        title: "Faster triage",
        description: "Teams can identify whether monitoring, therapy, or specialist referral is the most urgent next step.",
        icon: Stethoscope,
      },
      {
        title: "Tele-ready workflow",
        description: "Families can prepare for virtual or in-person consultations with the same structured information.",
        icon: Video,
      },
    ],
    sections: [
      {
        title: "Before the session",
        body:
          "Families can complete intake, screening, and milestone review ahead of time so more of the appointment is spent on interpretation and planning.",
      },
      {
        title: "After the session",
        body:
          "Recommendations can flow into therapy planning, milestone tracking, and ongoing reassessment.",
      },
    ],
  },
  parents: {
    eyebrow: "For Parents",
    title: "Support for families from first concern to next steps",
    description:
      "Parents can screen, track milestones, review reports, and organize follow-up care from one place without needing a clinical background to understand what comes next.",
    primaryCta: { label: "Get Started", to: "/signup" },
    secondaryCta: { label: "Explore Screening", to: "/screening" },
    highlights: [
      {
        title: "Clear guidance",
        description: "Results are translated into understandable concern levels and next actions.",
        icon: BadgeHelp,
      },
      {
        title: "Progress tracking",
        description: "Milestones and follow-up tools help families stay oriented between visits.",
        icon: Activity,
      },
      {
        title: "Confidence in conversations",
        description: "Structured summaries make pediatrician and therapist appointments more productive.",
        icon: HeartHandshake,
      },
    ],
    sections: [
      {
        title: "What parents can do here",
        body:
          "Screen development, organize child history, review reports, and monitor progress with tools that are designed to feel approachable.",
      },
      {
        title: "What this does not replace",
        body:
          "These tools support families and improve preparation, but they do not replace comprehensive clinical evaluation or diagnosis.",
      },
    ],
  },
  therapists: {
    eyebrow: "For Therapists",
    title: "A cleaner workflow for assessment-informed intervention",
    description:
      "Therapists can review structured findings, identify priority domains, and align home programs with clinical plans more efficiently.",
    primaryCta: { label: "Join as Therapist", to: "/signup" },
    secondaryCta: { label: "View Consultation Flow", to: "/consultation" },
    highlights: [
      {
        title: "Structured inputs",
        description: "Review focused screening outputs and intake details before evaluation or therapy planning.",
        icon: FileSearch,
      },
      {
        title: "Shared care planning",
        description: "Coordinate family-friendly activities with therapist goals and follow-up recommendations.",
        icon: HeartHandshake,
      },
      {
        title: "Faster documentation",
        description: "Use summarized concern areas and domain patterns to streamline communication.",
        icon: NotebookPen,
      },
    ],
    sections: [
      {
        title: "Therapist benefits",
        body:
          "Less time collecting baseline context manually, more time interpreting findings and delivering high-value intervention planning.",
      },
      {
        title: "Practice fit",
        body:
          "This works best as a decision-support layer that complements your clinical judgment, not as a substitute for it.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Flexible plans for families, therapists, and clinics",
    description:
      "Choose a setup that fits your workflow, from individual family access to multi-provider practice support.",
    primaryCta: { label: "Create an Account", to: "/signup" },
    secondaryCta: { label: "Book a Demo", to: "/book-demo" },
    highlights: [
      {
        title: "Family plans",
        description: "Screening, milestone tracking, and guided follow-up for parents.",
        icon: HeartHandshake,
      },
      {
        title: "Therapist plans",
        description: "Assessment support, reporting tools, and intervention workflows.",
        icon: Stethoscope,
      },
      {
        title: "Clinic plans",
        description: "Role-based access, scalability, and operational oversight for growing teams.",
        icon: ShieldCheck,
      },
    ],
    sections: [
      {
        title: "Need enterprise support?",
        body:
          "Use the demo path to discuss onboarding, clinic workflows, compliance needs, and team access requirements.",
      },
      {
        title: "Getting started",
        body:
          "You can begin with account creation and expand into consultation or clinic workflows when your team is ready.",
      },
    ],
  },
  blog: {
    eyebrow: "Blog",
    title: "Practical guidance on child development and early support",
    description:
      "Read approachable articles for families and professionals on developmental signs, screening, therapy routines, and care planning.",
    primaryCta: { label: "Start Screening", to: "/screening" },
    secondaryCta: { label: "Visit Help Center", to: "/help-center" },
    highlights: [
      { title: "Family education", description: "Articles explain common developmental concerns in plain language.", icon: Brain },
      { title: "Clinical context", description: "Posts can help therapists frame screening and follow-up decisions.", icon: Stethoscope },
      { title: "Actionable ideas", description: "Content stays focused on what families can do next.", icon: Sparkles },
    ],
    sections: [
      {
        title: "Editorial direction",
        body:
          "The content experience is designed to bridge everyday questions with clinically responsible guidance and clear next steps.",
      },
      {
        title: "Use with care",
        body:
          "Educational resources are supportive, but they should not be treated as personalized medical advice.",
      },
    ],
  },
  "help-center": {
    eyebrow: "Help Center",
    title: "Support for setup, workflows, and common questions",
    description:
      "Find guidance on using screening, intake, milestone tracking, and consultation tools across the platform.",
    primaryCta: { label: "Create an Account", to: "/signup" },
    secondaryCta: { label: "Read API Docs", to: "/api-docs" },
    highlights: [
      { title: "Onboarding help", description: "Get started faster with clear answers for common setup questions.", icon: BadgeHelp },
      { title: "Workflow guides", description: "Learn how intake, screening, and follow-up fit together.", icon: NotebookPen },
      { title: "Team enablement", description: "Help therapists and clinics adopt the platform consistently.", icon: ShieldCheck },
    ],
    sections: [
      {
        title: "Where to start",
        body:
          "Most teams begin with intake and screening, then move into reporting, milestone tracking, and consultation workflows.",
      },
      {
        title: "Need more",
        body:
          "If your use case involves broader integration or operational rollout, use the consultation and demo pathways for deeper support.",
      },
    ],
  },
  "api-docs": {
    eyebrow: "API Docs",
    title: "Integration-ready documentation for connected workflows",
    description:
      "Reference material for teams that want to connect external systems, automate workflows, or embed structured developmental data into their stack.",
    primaryCta: { label: "Book a Demo", to: "/book-demo" },
    secondaryCta: { label: "Open Help Center", to: "/help-center" },
    highlights: [
      { title: "Structured data", description: "Use predictable models for intake, screening, and reporting workflows.", icon: FileBadge2 },
      { title: "Operational fit", description: "Plan integrations with clinical and administrative systems in mind.", icon: ShieldCheck },
      { title: "Implementation support", description: "Use guided consultation when your team needs deeper rollout help.", icon: Microscope },
    ],
    sections: [
      {
        title: "Documentation scope",
        body:
          "API materials should help engineering teams understand what data flows are available and how they map to platform workflows.",
      },
      {
        title: "Best fit",
        body:
          "This is most relevant for clinics, digital health teams, and operational partners managing multi-system environments.",
      },
    ],
  },
  "privacy-policy": {
    eyebrow: "Privacy",
    title: "Privacy expectations for a sensitive care workflow",
    description:
      "Newro is designed for developmental and health-adjacent information, so privacy decisions should be understandable, intentional, and easy to review.",
    primaryCta: { label: "Review HIPAA Overview", to: "/hipaa-compliance" },
    secondaryCta: { label: "Read Terms", to: "/terms-of-service" },
    highlights: [
      { title: "Sensitive information", description: "Families and providers need clarity on what is collected and how it is used.", icon: ShieldCheck },
      { title: "Access expectations", description: "Teams should understand who can view and act on shared information.", icon: BadgeHelp },
      { title: "Operational transparency", description: "Policies should support trust as well as compliance.", icon: Scale },
    ],
    sections: [
      {
        title: "Policy intent",
        body:
          "Privacy guidance should explain collection, access, retention, and operational safeguards in language users can actually follow.",
      },
      {
        title: "User action",
        body:
          "Families and practices should review privacy expectations before using sensitive workflows or sharing clinical context.",
      },
    ],
  },
  "terms-of-service": {
    eyebrow: "Terms",
    title: "Terms that set clear expectations for platform use",
    description:
      "Terms should define usage boundaries, responsibilities, and the distinction between decision support and formal clinical care.",
    primaryCta: { label: "Read Privacy Overview", to: "/privacy-policy" },
    secondaryCta: { label: "Book a Demo", to: "/book-demo" },
    highlights: [
      { title: "Scope of use", description: "Clarifies what the platform is intended to support and what it is not meant to replace.", icon: Scale },
      { title: "Shared responsibilities", description: "Parents, therapists, and clinics each need role-appropriate expectations.", icon: HeartHandshake },
      { title: "Clinical boundaries", description: "Screening support does not equal diagnosis or independent treatment advice.", icon: Stethoscope },
    ],
    sections: [
      {
        title: "Important distinction",
        body:
          "The platform supports screening, planning, and communication, but clinical judgment and formal diagnosis remain the responsibility of qualified professionals.",
      },
      {
        title: "Operational fit",
        body:
          "Terms are especially important for clinics and professionals using shared records, team workflows, or integrated systems.",
      },
    ],
  },
  "hipaa-compliance": {
    eyebrow: "Compliance",
    title: "Compliance matters because developmental data deserves careful handling",
    description:
      "Healthcare and clinic workflows need confidence that privacy, access controls, and operational safeguards are considered from the start.",
    primaryCta: { label: "Book a Demo", to: "/book-demo" },
    secondaryCta: { label: "Read Privacy Overview", to: "/privacy-policy" },
    highlights: [
      { title: "Role-based access", description: "Clinical teams need the right people to see the right information.", icon: ShieldCheck },
      { title: "Audit-ready workflows", description: "Operational processes should support traceability and accountability.", icon: FileBadge2 },
      { title: "Implementation planning", description: "Compliance readiness works best when matched to your actual practice workflow.", icon: Microscope },
    ],
    sections: [
      {
        title: "For clinics",
        body:
          "Compliance conversations should cover data handling, staff access, intake flows, reporting, and any external systems that connect to care delivery.",
      },
      {
        title: "For families",
        body:
          "A compliance-first posture helps build trust that developmental information is treated with the seriousness it deserves.",
      },
    ],
  },
  "book-demo": {
    eyebrow: "Demo",
    title: "See how Newro fits your workflow before you commit",
    description:
      "Use the demo path to evaluate family onboarding, therapist workflows, clinic operations, and integration readiness with the right level of support.",
    primaryCta: { label: "Create an Account", to: "/signup" },
    secondaryCta: { label: "View Pricing", to: "/pricing" },
    highlights: [
      { title: "Workflow review", description: "Walk through intake, screening, reporting, milestones, and consultation patterns.", icon: Video },
      { title: "Role-specific guidance", description: "Parents, therapists, and clinics can focus on what matters to them most.", icon: HeartHandshake },
      { title: "Implementation discussion", description: "Use the demo to evaluate operational rollout and adoption needs.", icon: Sparkles },
    ],
    sections: [
      {
        title: "Best use of a demo",
        body:
          "Bring your real questions about onboarding, care coordination, follow-up, and reporting so the session maps to how your team actually works.",
      },
      {
        title: "What happens next",
        body:
          "After the demo, teams can decide whether to start with family use, therapist workflows, or a broader clinic rollout.",
      },
    ],
  },
};
