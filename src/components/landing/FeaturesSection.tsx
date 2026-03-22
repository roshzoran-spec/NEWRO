import { Brain, FileText, TrendingUp, Calendar, Video, ActivitySquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "AI Development Screening",
    desc: "Upload behavioral videos to instantly analyze autism markers and essential developmental milestones with advanced machine learning.",
    gradient: "from-primary to-glow-cyan",
  },
  {
    icon: ActivitySquare,
    title: "Smart Therapy Plans",
    desc: "AI-generated tailored speech and occupational therapy activities designed uniquely for your child's neurological profile.",
    gradient: "from-glow-cyan to-glow-purple",
  },
  {
    icon: TrendingUp,
    title: "Milestone Tracker",
    desc: "Interact with an animated, intelligent growth timeline that visually maps your child's cognitive and physical development.",
    gradient: "from-medical-teal to-medical-mint",
  },
  {
    icon: FileText,
    title: "AI Clinical Reports",
    desc: "Automated, standard-compliant professional clinical reports instantly generated for therapists, pediatricians, and parents.",
    gradient: "from-medical-lavender to-glow-purple",
  },
  {
    icon: Calendar,
    title: "Tele Consultation",
    desc: "Seamlessly book and attend high-definition virtual sessions with top-tier pediatric neuro-specialists worldwide.",
    gradient: "from-glow-purple to-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative bg-background overflow-hidden relative z-10">
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-medical-aqua/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] bg-medical-lavender/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-foreground">
            The World's Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-glow-purple">Advanced</span> Platform
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Beautifully designed intelligent tools that empower both parents and clinicians 
            with precision neurodevelopmental insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`glass-panel p-8 rounded-[2rem] group hover:-translate-y-2 transition-transform duration-500 overflow-hidden relative
                ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                ${i === 1 || i === 2 ? "md:col-span-1 lg:col-span-1" : ""}
                ${i === 3 || i === 4 ? "md:col-span-1 lg:col-span-1.5" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-8 shadow-glow`}>
                <f.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="font-display font-bold text-2xl mb-4 text-foreground tracking-tight">{f.title}</h3>
              <p className="text-muted-foreground font-light text-lg leading-relaxed">{f.desc}</p>
              
              <div className="mt-8 flex items-center text-primary font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
                Explore Feature
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
