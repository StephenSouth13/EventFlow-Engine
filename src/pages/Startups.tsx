import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Globe, Rocket, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const industries = ["All", "FinTech", "HealthTech", "EdTech", "AI/ML", "SaaS", "CleanTech"];

export default function Startups() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const { data: startups, isLoading } = useQuery({
    queryKey: ["startups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("startups")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const displayStartups = startups || [];

  const filteredStartups = displayStartups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(search.toLowerCase()) ||
      startup.tagline?.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || startup.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <Layout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Featured <span className="gradient-text">Startups</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover innovative startups showcasing at SISF 2026
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <Input
              placeholder="Search startups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(industry)}
                  className={selectedIndustry === industry ? "gradient-primary" : ""}
                >
                  {industry}
                </Button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" ref={ref}>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))
            ) : (
              filteredStartups.map((startup, index) => (
                <motion.div
                  key={startup.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                          <Rocket className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-xl font-semibold truncate">
                            {startup.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {startup.tagline}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {startup.industry && (
                          <Badge variant="secondary">{startup.industry}</Badge>
                        )}
                        {startup.stage && (
                          <Badge variant="outline">{startup.stage}</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {startup.team_size || "1-10"}
                        </span>
                        {startup.website_url && (
                          <a
                            href={startup.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
