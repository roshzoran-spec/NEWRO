import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const links = [
    { label: "AI Screening", href: "#features" },
    { label: "Smart Therapy", href: "#features" },
    { label: "Milestones", href: "#features" },
    { label: "Clinical Reports", href: "#features" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-black/20 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 transition-all duration-500">
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500" />
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-glow-cyan flex items-center justify-center shadow-glow">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight text-foreground">NEWRO</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:drop-shadow-md"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <Button asChild className="rounded-full shadow-glow bg-gradient-to-r from-primary to-glow-cyan hover:opacity-90 transition-opacity">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full hover:bg-white/50 dark:hover:bg-white/10">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full shadow-glow bg-gradient-to-r from-primary to-glow-purple hover:opacity-90 transition-opacity border-0">
                <Link to="/signup">Start Free Assessment</Link>
              </Button>
            </>
          )}
        </div>

        <button className="lg:hidden relative z-50 p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-4 mt-4">
                {user ? (
                  <Button asChild className="w-full rounded-2xl h-14 text-lg bg-gradient-to-r from-primary to-glow-cyan shadow-glow">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full rounded-2xl h-14 text-lg bg-white/50 backdrop-blur-md">
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full rounded-2xl h-14 text-lg bg-gradient-to-r from-primary to-glow-purple shadow-glow border-0">
                      <Link to="/signup">Start Free Assessment</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
