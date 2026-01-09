import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const investmentFocusOptions = ["FinTech", "HealthTech", "EdTech", "AI/ML", "SaaS", "CleanTech", "E-commerce", "Consumer", "B2B"];
const investmentStageOptions = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Growth"];

export default function InvestorApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    bio: "",
    linkedin_url: "",
    portfolio_url: "",
    investment_focus: [] as string[],
    investment_stages: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit your application");
      navigate("/auth?mode=login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("investors").insert({
        ...formData,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll review it soon.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

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
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Register as an <span className="gradient-text">Investor</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover promising startups and find your next investment opportunity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Investor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Partner"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Fund *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Venture Capital Firm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about your investment experience and focus"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Investment Focus</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {investmentFocusOptions.map((focus) => (
                        <div key={focus} className="flex items-center space-x-2">
                          <Checkbox
                            id={`focus-${focus}`}
                            checked={formData.investment_focus.includes(focus)}
                            onCheckedChange={() =>
                              setFormData({
                                ...formData,
                                investment_focus: toggleArrayValue(formData.investment_focus, focus),
                              })
                            }
                          />
                          <Label htmlFor={`focus-${focus}`} className="text-sm font-normal">
                            {focus}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Investment Stages</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {investmentStageOptions.map((stage) => (
                        <div key={stage} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stage-${stage}`}
                            checked={formData.investment_stages.includes(stage)}
                            onCheckedChange={() =>
                              setFormData({
                                ...formData,
                                investment_stages: toggleArrayValue(formData.investment_stages, stage),
                              })
                            }
                          />
                          <Label htmlFor={`stage-${stage}`} className="text-sm font-normal">
                            {stage}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
