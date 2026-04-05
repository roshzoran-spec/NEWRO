import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[3rem] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 60%, #162032 100%)' }}
        >
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#6FE7DD]/20 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#7AA7FF]/20 blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

          <div className="relative z-10 p-12 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black tracking-[0.2em] text-white/60 uppercase mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Start for free today
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight"
            >
              Every day matters.<br />
              <span style={{ background: 'linear-gradient(135deg, #AEEEEE, #6FE7DD, #7AA7FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Start tracking today.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white max-w-xl mx-auto mb-10 text-lg font-medium leading-relaxed"
            >
              Free AI-powered developmental assessment. Professional insights in minutes. No commitment required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button
                size="lg"
                asChild
                className="btn-pill h-14 px-10 text-base font-black border-none hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #6FE7DD, #7AA7FF)', color: '#1E293B' }}
              >
                <Link to={user ? "/dashboard" : "/signup"}>
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="btn-pill h-14 px-10 text-base font-black text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all"
              >
                <Link to="/milestones">Track Milestones</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
