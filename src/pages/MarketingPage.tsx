import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { marketingPages } from "@/data/marketingPages";

interface MarketingPageProps {
  pageKey: keyof typeof marketingPages;
}

const MarketingPage = ({ pageKey }: MarketingPageProps) => {
  const page = marketingPages[pageKey];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{page.eyebrow}</p>
            <h1 className="font-display text-lg font-bold text-foreground">{page.title}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="rounded-[2rem] border border-border bg-card/90 p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">{page.eyebrow}</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{page.title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{page.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {page.primaryCta ? (
              <Button asChild size="lg" className="rounded-full shadow-glow">
                <Link to={page.primaryCta.to}>
                  {page.primaryCta.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            ) : null}
            {page.secondaryCta ? (
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to={page.secondaryCta.to}>{page.secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {page.highlights.map((item) => (
            <div key={item.title} className="rounded-3xl border border-border bg-background/80 p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-border bg-background/70 p-7">
              <h3 className="font-display text-2xl font-bold text-foreground">{section.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default MarketingPage;
