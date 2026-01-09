import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Rocket, TrendingUp, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ctaCards = [
  {
    icon: Rocket,
    title: "Startups",
    description: "Get funding, mentorship, and exposure",
    action: "Apply Now",
    href: "/apply/startup",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description: "Discover the next unicorn startup",
    action: "Join as Investor",
    href: "/apply/investor",
  },
  {
    icon: Building,
    title: "Sponsors",
    description: "Partner with the innovation ecosystem",
    action: "Become a Sponsor",
    href: "/apply/sponsor",
  },
];

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute inset-0 bg-hero-pattern" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Join the <span className="gradient-text">Movement</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of Asia's most impactful startup event
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {ctaCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card variant="glow" className="h-full group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 mx-auto shadow-glow group-hover:shadow-glow-intense transition-shadow">
                    <card.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {card.description}
                  </p>
                  <Button variant="outline" className="group/btn" asChild>
                    <Link to={card.href}>
                      {card.action}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card variant="glass" className="inline-block">
            <CardContent className="p-8 md:p-12">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to transform your startup journey?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Register now to secure your spot at the most anticipated startup event of 2026
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=signup">
                  Register for SISF 2026
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
