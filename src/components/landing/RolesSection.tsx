import { Baby, Stethoscope, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const roles = [
  {
    icon: Baby,
    title: "For Parents",
    desc: "Track your child's milestones, complete digital assessments, access AI reports, and get guided home therapy activities — all in one place.",
    features: ["Child profile & milestone tracker", "Digital screening assessments", "AI-generated reports", "Home therapy programs", "Chatbot support"],
    cta: "Start as Parent",
    color: "border-coral/30 hover:border-coral/60",
    iconBg: "bg-coral-light text-coral",
  },
  {
    icon: Stethoscope,
    title: "For Therapists",
    desc: "Streamline your practice with AI-assisted scoring, auto-generated clinical reports, therapy plan builders, and a powerful case management dashboard.",
    features: ["AI scoring system", "Auto-generate reports", "Therapy plan builder", "Session notes & progress", "Teleconsultation"],
    cta: "Join as Therapist",
    color: "border-primary/30 hover:border-primary/60",
    iconBg: "bg-secondary text-primary",
  },
  {
    icon: Building2,
    title: "For Clinics",
    desc: "Manage your entire center — therapist verification, appointment scheduling, analytics, compliance, and subscription management at enterprise scale.",
    features: ["Multi-therapist management", "Analytics dashboard", "Revenue tracking", "Compliance controls", "White-label option"],
    cta: "Enterprise Plan",
    color: "border-lavender-foreground/20 hover:border-lavender-foreground/40",
    iconBg: "bg-lavender text-lavender-foreground",
  },
];

const RolesSection = () => {
  return (
    <section id="roles" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Built for <span className="text-gradient-primary">everyone</span> in the care journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a parent, therapist, or clinic — Newro adapts to your needs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {roles.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl bg-card border-2 ${r.color} p-8 transition-all duration-300`}
            >
              <div className={`w-14 h-14 rounded-xl ${r.iconBg} flex items-center justify-center mb-6`}>
                <r.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-card-foreground">{r.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{r.desc}</p>
              <ul className="space-y-2 mb-8">
                {r.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-card-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/signup">{r.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
