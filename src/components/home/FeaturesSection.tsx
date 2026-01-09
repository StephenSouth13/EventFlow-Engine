import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Rocket, 
  Users, 
  Mic2, 
  Lightbulb, 
  Handshake, 
  Trophy,
  icons
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCMSFeatures, useCMSFeatureItems } from "@/hooks/useCMS";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Users,
  Mic2,
  Lightbulb,
  Handshake,
  Trophy,
};

function getIcon(iconName: string) {
  // First check our custom map
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  // Then check lucide-react icons
  const LucideIcon = icons[iconName as keyof typeof icons];
  if (LucideIcon) {
    return LucideIcon;
  }
  // Fallback
  return Rocket;
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { data: featuresSection, isLoading: isLoadingSection } = useCMSFeatures();
  const { data: featureItems, isLoading: isLoadingItems } = useCMSFeatureItems();

  const isLoading = isLoadingSection || isLoadingItems;

  if (isLoading) {
    return (
      <section className="py-24" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultFeatures = [
    { id: '1', icon_name: "Rocket", title: "Startup Pitching", description: "Showcase your startup to top-tier investors and win funding opportunities." },
    { id: '2', icon_name: "Handshake", title: "1:1 Matchmaking", description: "Connect with relevant investors, partners, and mentors through AI-powered matching." },
    { id: '3', icon_name: "Mic2", title: "Expert Talks", description: "Learn from industry leaders and successful entrepreneurs sharing their insights." },
    { id: '4', icon_name: "Users", title: "Networking Events", description: "Build meaningful connections at curated networking sessions and social events." },
    { id: '5', icon_name: "Lightbulb", title: "Innovation Labs", description: "Hands-on workshops exploring cutting-edge technologies and methodologies." },
    { id: '6', icon_name: "Trophy", title: "Startup Awards", description: "Compete for recognition and prizes across multiple startup categories." },
  ];

  const displayFeatures = featureItems && featureItems.length > 0 ? featureItems : defaultFeatures;

  return (
    <section className="py-24" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            {featuresSection?.section_title ? (
              <>
                {featuresSection.section_title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-text">
                  {featuresSection.section_title.split(' ').slice(-1)[0]}
                </span>
              </>
            ) : (
              <>
                What to <span className="gradient-text">Expect</span>
              </>
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {featuresSection?.section_subtitle || "Three days packed with opportunities to learn, connect, and grow your startup"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayFeatures.map((feature, index) => {
            const IconComponent = getIcon(feature.icon_name);
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:shadow-glow-intense transition-shadow">
                      <IconComponent className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
