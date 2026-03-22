import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-cta p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Start your child's development journey today
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg">
              Free AI-powered assessment. Professional reports in minutes. No commitment required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="font-semibold"
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
