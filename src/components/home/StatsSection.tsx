import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useCMSStats } from "@/hooks/useCMS";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { data: stats, isLoading } = useCMSStats();

  if (isLoading) {
    return (
      <section className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-10 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayStats = stats && stats.length > 0 ? stats : [
    { id: '1', value: "5,000+", label: "Attendees" },
    { id: '2', value: "200+", label: "Startups" },
    { id: '3', value: "150+", label: "Investors" },
    { id: '4', value: "50+", label: "Speakers" },
    { id: '5', value: "$10M+", label: "Deals Closed" },
    { id: '6', value: "30+", label: "Countries" },
  ];

  return (
    <section className="py-20 bg-card/30 border-y border-border/50">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
