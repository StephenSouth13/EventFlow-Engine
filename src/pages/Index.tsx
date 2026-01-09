import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { useCMSSections } from "@/hooks/useCMSNavigation";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: sections, isLoading } = useCMSSections();

  const isVisible = (key: string) => {
    const section = sections?.find((s) => s.section_key === key);
    return section?.is_visible ?? true;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isVisible("hero") && <HeroSection />}
      {isVisible("countdown") && <CountdownTimer />}
      {isVisible("stats") && <StatsSection />}
      {isVisible("features") && <FeaturesSection />}
      {isVisible("cta") && <CTASection />}
    </Layout>
  );
};

export default Index;
