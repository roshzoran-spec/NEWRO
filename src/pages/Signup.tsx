import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, ArrowLeft, Baby, Stethoscope, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  { id: "parent", label: "Parent", icon: Baby, desc: "Track your child's growth" },
  { id: "therapist", label: "Therapist", icon: Stethoscope, desc: "Manage cases & reports" },
  { id: "clinic", label: "Clinic", icon: Building2, desc: "Enterprise management" },
];

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState("parent");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">Newro</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-card-foreground">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Choose your role to get started</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  selectedRole === r.id
                    ? "border-primary bg-secondary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <r.icon className={`w-5 h-5 mx-auto mb-1 ${selectedRole === r.id ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-xs font-medium ${selectedRole === r.id ? "text-primary" : "text-muted-foreground"}`}>
                  {r.label}
                </p>
              </button>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Dr. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full shadow-glow" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
