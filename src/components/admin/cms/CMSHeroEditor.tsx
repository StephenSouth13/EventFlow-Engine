import { useState, useEffect } from "react";
import { useCMSHero, useUpdateCMSHero, uploadCMSImage } from "@/hooks/useCMS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Loader2 } from "lucide-react";

export function CMSHeroEditor() {
  const { data: hero, isLoading } = useCMSHero();
  const updateHero = useUpdateCMSHero();
  const { toast } = useToast();
  const [form, setForm] = useState({
    badge_text: "",
    title_line1: "",
    title_line2: "",
    subtitle: "",
    event_date: "",
    event_location: "",
    attendees_text: "",
    cta_primary_text: "",
    cta_primary_link: "",
    cta_secondary_text: "",
    cta_secondary_link: "",
    background_image_url: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        badge_text: hero.badge_text || "",
        title_line1: hero.title_line1 || "",
        title_line2: hero.title_line2 || "",
        subtitle: hero.subtitle || "",
        event_date: hero.event_date || "",
        event_location: hero.event_location || "",
        attendees_text: hero.attendees_text || "",
        cta_primary_text: hero.cta_primary_text || "",
        cta_primary_link: hero.cta_primary_link || "",
        cta_secondary_text: hero.cta_secondary_text || "",
        cta_secondary_link: hero.cta_secondary_link || "",
        background_image_url: hero.background_image_url || "",
      });
    }
  }, [hero]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero?.id) return;

    try {
      await updateHero.mutateAsync({ id: hero.id, ...form });
      toast({ title: "Saved!", description: "Hero section updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCMSImage(file, "hero");
      setForm({ ...form, background_image_url: url });
      toast({ title: "Uploaded!", description: "Background image uploaded." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Badge Text</Label>
          <Input
            value={form.badge_text}
            onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
            placeholder="Registrations Now Open"
          />
        </div>

        <div className="space-y-2">
          <Label>Attendees Text</Label>
          <Input
            value={form.attendees_text}
            onChange={(e) => setForm({ ...form, attendees_text: e.target.value })}
            placeholder="5,000+ Attendees"
          />
        </div>

        <div className="space-y-2">
          <Label>Title Line 1</Label>
          <Input
            value={form.title_line1}
            onChange={(e) => setForm({ ...form, title_line1: e.target.value })}
            placeholder="Startup & Innovation"
          />
        </div>

        <div className="space-y-2">
          <Label>Title Line 2 (Gradient)</Label>
          <Input
            value={form.title_line2}
            onChange={(e) => setForm({ ...form, title_line2: e.target.value })}
            placeholder="Spring Festival 2026"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Subtitle</Label>
          <Textarea
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Where visionary founders meet..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Event Date</Label>
          <Input
            value={form.event_date}
            onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            placeholder="April 15-17, 2026"
          />
        </div>

        <div className="space-y-2">
          <Label>Event Location</Label>
          <Input
            value={form.event_location}
            onChange={(e) => setForm({ ...form, event_location: e.target.value })}
            placeholder="Innovation Hub, Singapore"
          />
        </div>

        <div className="space-y-2">
          <Label>Primary CTA Text</Label>
          <Input
            value={form.cta_primary_text}
            onChange={(e) => setForm({ ...form, cta_primary_text: e.target.value })}
            placeholder="Register Now"
          />
        </div>

        <div className="space-y-2">
          <Label>Primary CTA Link</Label>
          <Input
            value={form.cta_primary_link}
            onChange={(e) => setForm({ ...form, cta_primary_link: e.target.value })}
            placeholder="/auth?mode=signup"
          />
        </div>

        <div className="space-y-2">
          <Label>Secondary CTA Text</Label>
          <Input
            value={form.cta_secondary_text}
            onChange={(e) => setForm({ ...form, cta_secondary_text: e.target.value })}
            placeholder="Apply as Startup"
          />
        </div>

        <div className="space-y-2">
          <Label>Secondary CTA Link</Label>
          <Input
            value={form.cta_secondary_link}
            onChange={(e) => setForm({ ...form, cta_secondary_link: e.target.value })}
            placeholder="/apply/startup"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Background Image</Label>
          <div className="flex items-center gap-4">
            <Input
              value={form.background_image_url}
              onChange={(e) => setForm({ ...form, background_image_url: e.target.value })}
              placeholder="https://..."
              className="flex-1"
            />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" disabled={uploading} asChild>
                <span>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                </span>
              </Button>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {form.background_image_url && (
            <img src={form.background_image_url} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
          )}
        </div>
      </div>

      <Button type="submit" variant="hero" disabled={updateHero.isPending}>
        {updateHero.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </form>
  );
}
