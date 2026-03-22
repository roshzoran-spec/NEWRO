import { Brain, FileText, TrendingUp, Activity, Video } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Development Screening",
    desc: "Upload video to automatically analyze autism indicators and developmental milestones with state-of-the-art precision.",
    color: "from-primary to-teal-400",
    shadow: "shadow-glow",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    icon: Activity,
    title: "Smart Therapy Plans",
    desc: "AI-generated personalized speech and developmental therapy activities perfectly tailored for rapid growth.",
    color: "from-ai-purple to-[#a78bfa]",
    shadow: "shadow-glow-ai",
    span: "col-span-1 md:col-span-1 lg:col-span-1",
  },
  {
    icon: TrendingUp,
    title: "Milestone Tracker",
    desc: "Animated growth timeline with real-time tracking for every exciting step of your child's developmental journey.",
    color: "from-[#34d399] to-[#6ee7b7]", 
    shadow: "shadow-sm",
    span: "col-span-1",
  },
  {
    icon: FileText,
    title: "AI Clinical Reports",
    desc: "Instant, automatic professional diagnostic reports formatted beautifully for therapists, clinicians, and parents.",
    color: "from-[#38bdf8] to-[#7dd3fc]",
    shadow: "shadow-sm",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Video,
    title: "Tele Consultation",
    desc: "Seamlessly book and attend high-quality video sessions with world-class pediatric therapists directly from the app.",
    color: "from-[#fb923c] to-[#fdba74]",
    shadow: "shadow-sm",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-ai-purple/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium mb-6 text-primary border border-primary/20">
             Next-Generation Ecosystem
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground leading-tight">
            Complete Pediatric <br className="hidden sm:block" />
            <span className="text-gradient-primary">Intelligence Platform</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Everything your child needs, from the first screening to comprehensive therapy sessions—powered by the most sophisticated AI ever built for pediatric care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className={`group relative p-8 md:p-10 rounded-[2rem] glass-panel border border-white/60 hover:border-primary/40 hover:bg-white/80 transition-all duration-500 hover:-translate-y-2 ${f.span}`}
            >
              <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/60 to-white/0 pointer-events-none" />
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-8 text-white ${f.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                <f.icon className="w-7 h-7" />
              </div>
              
              <h3 className="font-display font-bold text-2xl md:text-3xl mb-4 text-foreground tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-lg">{f.desc}</p>
              
              {/* Subtle hover glow at bottom of card */}
              <div className="absolute -bottom-2 inset-x-10 h-10 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
