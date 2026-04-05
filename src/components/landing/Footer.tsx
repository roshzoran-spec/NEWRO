import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">Newro</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered neurodevelopment platform for parents, therapists, and clinics.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#roles" className="hover:text-foreground transition-colors">For Parents</a></li>
              <li><a href="#roles" className="hover:text-foreground transition-colors">For Therapists</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Newro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
