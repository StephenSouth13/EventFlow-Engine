
//D:\Website\EventFlow-Engine\src\components\admin\cms\CMSCTAEditor.tsx
import { useState, useEffect } from "react";
import { useCMSCTA, useCMSCTACards, useUpdateCMSCTA, useUpdateCMSCTACard } from "@/hooks/useCMS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconOptions = [
  "Rocket", "TrendingUp", "Building", "Users", "Star", "Target", "Zap", "Globe"
];

export function CMSCTAEditor() {
  const { data: cta, isLoading: ctaLoading } = useCMSCTA();
  const { data: cards, isLoading: cardsLoading } = useCMSCTACards();
  const updateCTA = useUpdateCMSCTA();
  const updateCard = useUpdateCMSCTACard();
  const { toast } = useToast();

  const [form, setForm] = useState({
    section_title: "",
    section_subtitle: "",
    final_cta_title: "",
    final_cta_subtitle: "",
    final_cta_button_text: "",
    final_cta_button_link: "",
  });

  useEffect(() => {
    if (cta) {
      setForm({
        section_title: cta.section_title || "",
        section_subtitle: cta.section_subtitle || "",
        final_cta_title: cta.final_cta_title || "",
        final_cta_subtitle: cta.final_cta_subtitle || "",
        final_cta_button_text: cta.final_cta_button_text || "",
        final_cta_button_link: cta.final_cta_button_link || "",
      });
    }
  }, [cta]);

  const handleSave = async () => {
    if (!cta?.id) return;
    try {
      await updateCTA.mutateAsync({ id: cta.id, ...form });
      toast({ title: "Saved!", description: "CTA section updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateCard = async (id: string, field: string, value: any) => {
    try {
      await updateCard.mutateAsync({ id, [field]: value });
      toast({ title: "Updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (ctaLoading || cardsLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold">Section Header</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.section_title}
              onChange={(e) => setForm({ ...form, section_title: e.target.value })}
              placeholder="Join the Movement"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={form.section_subtitle}
              onChange={(e) => setForm({ ...form, section_subtitle: e.target.value })}
              placeholder="Be part of..."
            />
          </div>
        </div>
      </div>

      {/* CTA Cards */}
      <div className="space-y-4">
        <h3 className="font-semibold">CTA Cards</h3>
        
        {cards?.map((card) => (
          <div key={card.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <Select
                value={card.icon_name}
                onValueChange={(v) => handleUpdateCard(card.id, "icon_name", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                defaultValue={card.title}
                onBlur={(e) => handleUpdateCard(card.id, "title", e.target.value)}
                placeholder="Title"
              />

              <Input
                defaultValue={card.button_text}
                onBlur={(e) => handleUpdateCard(card.id, "button_text", e.target.value)}
                placeholder="Button text"
              />

              <Input
                defaultValue={card.button_link}
                onBlur={(e) => handleUpdateCard(card.id, "button_link", e.target.value)}
                placeholder="Button link"
              />
            </div>

            <Textarea
              defaultValue={card.description}
              onBlur={(e) => handleUpdateCard(card.id, "description", e.target.value)}
              placeholder="Description"
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold">Final CTA Block</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.final_cta_title}
              onChange={(e) => setForm({ ...form, final_cta_title: e.target.value })}
              placeholder="Ready to transform..."
            />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={form.final_cta_button_text}
              onChange={(e) => setForm({ ...form, final_cta_button_text: e.target.value })}
              placeholder="Register for SISF 2026"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Subtitle</Label>
            <Textarea
              value={form.final_cta_subtitle}
              onChange={(e) => setForm({ ...form, final_cta_subtitle: e.target.value })}
              placeholder="Register now to secure..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Button Link</Label>
            <Input
              value={form.final_cta_button_link}
              onChange={(e) => setForm({ ...form, final_cta_button_link: e.target.value })}
              placeholder="/auth?mode=signup"
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} variant="hero" disabled={updateCTA.isPending}>
        {updateCTA.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save All Changes
      </Button>
    </div>
  );
}
