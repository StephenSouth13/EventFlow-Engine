import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const sponsorTiers = [
  {
    id: "bronze",
    name: "Bronze",
    price: "$5,000",
    benefits: ["Logo on website", "2 event passes", "Social media mention"],
  },
  {
    id: "silver",
    name: "Silver",
    price: "$15,000",
    benefits: ["All Bronze benefits", "Exhibition booth", "5 event passes", "Newsletter feature"],
  },
  {
    id: "gold",
    name: "Gold",
    price: "$30,000",
    benefits: ["All Silver benefits", "Main stage recognition", "10 event passes", "Speaking slot"],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$50,000",
    benefits: ["All Gold benefits", "Title sponsor recognition", "VIP networking", "Keynote opportunity"],
  },
];

export default function SponsorApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    tier: "silver",
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
      const { error } = await supabase.from("sponsors").insert({
        ...formData,
        user_id: user.id,
        is_active: false,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! Our team will contact you shortly.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
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
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Become a <span className="gradient-text">Sponsor</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with the innovation ecosystem and showcase your brand to thousands of attendees
            </p>
          </motion.div>

          {/* Sponsorship Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-6xl mx-auto"
          >
            {sponsorTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`cursor-pointer transition-all ${
                  formData.tier === tier.id
                    ? "border-primary shadow-glow"
                    : "bg-card/50 border-border/50 hover:border-primary/30"
                }`}
                onClick={() => setFormData({ ...formData, tier: tier.id })}
              >
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold mb-1">{tier.name}</h3>
                  <p className="text-2xl font-bold gradient-text mb-4">{tier.price}</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your company name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">About Your Company</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your company and why you want to sponsor SISF"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Selected Tier</Label>
                    <RadioGroup
                      value={formData.tier}
                      onValueChange={(value) => setFormData({ ...formData, tier: value })}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {sponsorTiers.map((tier) => (
                        <div key={tier.id}>
                          <RadioGroupItem
                            value={tier.id}
                            id={tier.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={tier.id}
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                          >
                            <span className="font-semibold">{tier.name}</span>
                            <span className="text-sm text-muted-foreground">{tier.price}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
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
