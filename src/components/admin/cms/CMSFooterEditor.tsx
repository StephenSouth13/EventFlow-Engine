import { useState, useEffect } from "react";
import { useCMSFooter, useUpdateCMSFooter } from "@/hooks/useCMS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

export function CMSFooterEditor() {
  const { data: footer, isLoading } = useCMSFooter();
  const updateFooter = useUpdateCMSFooter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    brand_description: "",
    copyright_text: "",
    event_info: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: "",
    youtube_url: "",
  });

  useEffect(() => {
    if (footer) {
      setForm({
        brand_description: footer.brand_description || "",
        copyright_text: footer.copyright_text || "",
        event_info: footer.event_info || "",
        twitter_url: footer.twitter_url || "",
        linkedin_url: footer.linkedin_url || "",
        instagram_url: footer.instagram_url || "",
        youtube_url: footer.youtube_url || "",
      });
    }
  }, [footer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footer?.id) return;

    try {
      await updateFooter.mutateAsync({ id: footer.id, ...form });
      toast({ title: "Saved!", description: "Footer updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Brand Description</Label>
        <Textarea
          value={form.brand_description}
          onChange={(e) => setForm({ ...form, brand_description: e.target.value })}
          placeholder="The premier startup and innovation festival..."
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Copyright Text</Label>
          <Input
            value={form.copyright_text}
            onChange={(e) => setForm({ ...form, copyright_text: e.target.value })}
            placeholder="© 2026 SISF. All rights reserved."
          />
        </div>

        <div className="space-y-2">
          <Label>Event Info</Label>
          <Input
            value={form.event_info}
            onChange={(e) => setForm({ ...form, event_info: e.target.value })}
            placeholder="April 15-17, 2026 • Singapore"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Social Media Links</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Twitter URL</Label>
            <Input
              value={form.twitter_url}
              onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/company/..."
            />
          </div>

          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      </div>

      <Button type="submit" variant="hero" disabled={updateFooter.isPending}>
        {updateFooter.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </form>
  );
}
