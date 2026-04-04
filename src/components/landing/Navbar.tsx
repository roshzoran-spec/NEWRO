import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const links = [
    { label: "Screening", to: "/screening" },
    { label: "Therapy", to: "/therapy" },
    { label: "Milestones", to: "/milestones" },
    ...(user ? [{ label: "Video Screening", to: "/video-screening" }] : []),
    { label: "Consultation", to: "/consultation" },
  ];

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="container mx-auto glass-nav h-16 rounded-full flex items-center justify-between px-6 border-white/60 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08)] bg-white/60 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#AEEEEE] via-[#6FE7DD] to-[#7AA7FF] flex items-center justify-center shadow-glow-soft group-hover:rotate-12 transition-all duration-500">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-foreground decoration-[#6FE7DD]/40 underline-offset-4 group-hover:underline">NEWRO</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/60 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button asChild className="btn-pill bg-foreground text-background hover:bg-foreground/90 font-black shadow-xl border-none h-10">
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-white/40 h-10 px-6">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="btn-pill bg-gradient-to-r from-[#6FE7DD] to-[#7AA7FF] text-foreground font-black shadow-glow-soft border-none h-10 px-8 hover:scale-105 transition-all">
                <Link to="/signup">Start Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground p-2 rounded-full hover:bg-white/40 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="md:hidden mt-3 container mx-auto glass-nav rounded-3xl border-white/60 overflow-hidden shadow-2xl bg-white/80 backdrop-blur-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-5">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-xl font-black text-foreground hover:text-primary transition-colors py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-6 border-t border-black/5">
                {user ? (
                  <Button asChild className="btn-pill bg-foreground text-background w-full h-12 shadow-glow-soft font-black">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="rounded-full border-black/10 text-foreground w-full h-12 hover:bg-white/40 font-black">
                      <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
                    </Button>
                    <Button asChild className="btn-pill bg-gradient-to-r from-[#6FE7DD] to-[#7AA7FF] text-foreground w-full h-12 shadow-glow-soft font-black">
                      <Link to="/signup" onClick={() => setMobileOpen(false)}>Create Account</Link>
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
