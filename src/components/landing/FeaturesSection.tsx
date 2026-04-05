import { Brain, FileText, TrendingUp, Activity, Video } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Development Screening",
    desc: "Upload video to automatically analyze autism indicators and developmental milestones with state-of-the-art precision.",
    color: "from-teal-400 to-cyan-500",
    accent: "bg-teal-50 border-teal-100",
    span: "lg:col-span-2",
  },
  {
    icon: Activity,
    title: "Smart Therapy Plans",
    desc: "AI-generated personalized speech and developmental therapy activities perfectly tailored for rapid growth.",
    color: "from-violet-400 to-purple-500",
    accent: "bg-violet-50 border-violet-100",
    span: "lg:col-span-1",
  },
  {
    icon: TrendingUp,
    title: "Milestone Tracker",
    desc: "Animated growth timeline with real-time tracking for every exciting step of your child's developmental journey.",
    color: "from-emerald-400 to-green-500",
    accent: "bg-emerald-50 border-emerald-100",
    span: "lg:col-span-1",
  },
  {
    icon: FileText,
    title: "AI Clinical Reports",
    desc: "Instant, automatic professional diagnostic reports formatted beautifully for therapists, clinicians, and parents.",
    color: "from-blue-500 to-indigo-600",
    accent: "bg-blue-50 border-blue-100",
    span: "lg:col-span-1",
  },
  {
    icon: Video,
    title: "Tele Consultation",
    desc: "Seamlessly book and attend high-quality video sessions with world-class pediatric therapists directly from the app.",
    color: "from-orange-400 to-amber-500",
    accent: "bg-orange-50 border-orange-100",
    span: "lg:col-span-1",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-sm font-bold mb-6 text-teal-600 border border-teal-100 uppercase tracking-widest">
            Next-Generation Ecosystem
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-5 tracking-tight text-foreground leading-tight">
            Complete Pediatric{" "}
            <span className="text-gradient-newro italic">Intelligence Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Everything your child needs, from first screening to comprehensive therapy—powered by AI built for pediatric care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className={`group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-400 cursor-default ${f.span}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                <f.icon className="w-6 h-6" />
              </div>

              <h3 className="font-display font-black text-xl mb-3 text-foreground tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-base">{f.desc}</p>

              {/* Subtle hover accent line */}
              <div className={`absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
