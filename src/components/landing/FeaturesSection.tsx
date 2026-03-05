import { Brain, FileText, TrendingUp, Calendar, MessageCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Assessments",
    desc: "Standardized digital screening for speech delay, autism, ADHD, and developmental milestones with adaptive scoring.",
    color: "bg-secondary text-primary",
  },
  {
    icon: FileText,
    title: "Smart Reports",
    desc: "AI-generated professional clinical reports with risk summaries, scoring charts, and therapy recommendations.",
    color: "bg-coral-light text-coral",
  },
  {
    icon: TrendingUp,
    title: "Milestone Tracking",
    desc: "Age-based milestone database with monthly tracking, red flag detection, and automatic regression alerts.",
    color: "bg-mint text-mint-foreground",
  },
  {
    icon: Calendar,
    title: "Therapy Planning",
    desc: "AI-generated 4–8 week structured therapy plans with session goals, home programs, and parent instructions.",
    color: "bg-lavender text-lavender-foreground",
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    desc: "RAG-based chatbot for parent education, activity suggestions, milestone guidance, and therapy support.",
    color: "bg-warm text-warm-foreground",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    desc: "End-to-end encryption, role-based access, and HIPAA-style compliance for complete data protection.",
    color: "bg-secondary text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything you need for{" "}
            <span className="text-gradient-primary">child development</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From screening to therapy planning — Newro provides a complete AI-powered ecosystem for neurodevelopmental care.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-card-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
