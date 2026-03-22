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
    { label: "Screening", href: "#screening" },
    { label: "Therapy", href: "#therapy" },
    { label: "Milestones", href: "#milestones" },
    { label: "Consultation", href: "#consultation" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-white/20 m-4 rounded-2xl shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center shadow-glow group-hover:shadow-glow-ai transition-all duration-500">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">NEWRO</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button asChild className="rounded-full shadow-glow bg-primary hover:bg-primary/90 text-white">
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full hover:bg-primary/10 text-primary font-medium">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full shadow-glow bg-primary hover:bg-primary/90 text-white font-medium px-6">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/20 overflow-hidden rounded-b-2xl mt-1"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
                {user ? (
                  <Button asChild className="rounded-full shadow-glow bg-primary hover:bg-primary/90 text-white w-full h-12">
                    <Link to="/dashboard">
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="rounded-full border-primary/20 text-primary w-full h-12">
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild className="rounded-full shadow-glow bg-primary hover:bg-primary/90 text-white w-full h-12">
                      <Link to="/signup">Get Started</Link>
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
