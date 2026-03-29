import { motion } from "framer-motion";
import { ShieldCheck, Database, Zap, Globe, Star } from "lucide-react";

const stats = [
  { 
    id: 1, 
    value: "98%", 
    label: "Clinical Accuracy", 
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  { 
    id: 2, 
    value: "50,000+", 
    label: "Assessments Completed", 
    icon: Database,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  { 
    id: 3, 
    value: "Early", 
    label: "AI-Powered Detection", 
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  { 
    id: 4, 
    value: "Global", 
    label: "Trusted by Clinicians", 
    icon: Globe,
    color: "text-accent-indigo",
    bg: "bg-accent/10"
  }
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-background border-y border-white/40">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-6 p-6 rounded-3xl glass-card border-none hover:shadow-xl transition-all duration-500 hover:scale-105 group"
            >
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors duration-500 group-hover:bg-primary group-hover:text-white`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground leading-none mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verified Logos / Social Proof */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 flex flex-wrap items-center justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        >
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">
            <Star className="fill-current" /> TrustCare
          </div>
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">
             MedLink AI
          </div>
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">
            <ShieldCheck className="fill-current" /> BioMetric
          </div>
          <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-tighter">
            Pediatric Network
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
