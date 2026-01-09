import { useState, useEffect } from "react";
import { useCMSSettings, useUpdateCMSSettings, uploadCMSImage } from "@/hooks/useCMS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Loader2 } from "lucide-react";

export function CMSSettingsEditor() {
  const { data: settings, isLoading } = useCMSSettings();
  const updateSettings = useUpdateCMSSettings();
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);

  const [form, setForm] = useState({
    site_name: "",
    logo_url: "",
    meta_title: "",
    meta_description: "",
    og_image_url: "",
    event_start_date: "",
    event_end_date: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        site_name: settings.site_name || "",
        logo_url: settings.logo_url || "",
        meta_title: settings.meta_title || "",
        meta_description: settings.meta_description || "",
        og_image_url: settings.og_image_url || "",
        event_start_date: settings.event_start_date?.split("T")[0] || "",
        event_end_date: settings.event_end_date?.split("T")[0] || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings?.id) return;

    try {
      await updateSettings.mutateAsync({
        id: settings.id,
        ...form,
        event_start_date: form.event_start_date ? new Date(form.event_start_date).toISOString() : undefined,
        event_end_date: form.event_end_date ? new Date(form.event_end_date).toISOString() : undefined,
      });
      toast({ title: "Saved!", description: "Settings updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "og_image_url") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      const url = await uploadCMSImage(file, field === "logo_url" ? "logo" : "og");
      setForm({ ...form, [field]: url });
      toast({ title: "Uploaded!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Site Name</Label>
          <Input
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
            placeholder="SISF 2026"
          />
        </div>

        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="flex items-center gap-4">
            <Input
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              placeholder="https://..."
              className="flex-1"
            />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" disabled={uploading === "logo_url"} asChild>
                <span>
                  {uploading === "logo_url" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </span>
              </Button>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "logo_url")} />
            </label>
          </div>
          {form.logo_url && <img src={form.logo_url} alt="Logo" className="h-12 mt-2" />}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Meta Title (SEO)</Label>
          <Input
            value={form.meta_title}
            onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            placeholder="Startup & Innovation Spring Festival 2026"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Meta Description (SEO)</Label>
          <Textarea
            value={form.meta_description}
            onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
            placeholder="Join Asia's premier startup event..."
            rows={2}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>OG Image (Social Sharing)</Label>
          <div className="flex items-center gap-4">
            <Input
              value={form.og_image_url}
              onChange={(e) => setForm({ ...form, og_image_url: e.target.value })}
              placeholder="https://..."
              className="flex-1"
            />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" disabled={uploading === "og_image_url"} asChild>
                <span>
                  {uploading === "og_image_url" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </span>
              </Button>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "og_image_url")} />
            </label>
          </div>
          {form.og_image_url && <img src={form.og_image_url} alt="OG Image" className="h-32 mt-2 rounded-lg object-cover" />}
        </div>

        <div className="space-y-2">
          <Label>Event Start Date</Label>
          <Input
            type="date"
            value={form.event_start_date}
            onChange={(e) => setForm({ ...form, event_start_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Event End Date</Label>
          <Input
            type="date"
            value={form.event_end_date}
            onChange={(e) => setForm({ ...form, event_end_date: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" variant="hero" disabled={updateSettings.isPending}>
        {updateSettings.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Settings
      </Button>
    </form>
  );
}
