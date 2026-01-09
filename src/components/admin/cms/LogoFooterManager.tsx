import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BrandingSettings {
  id: string;
  header_logo_url: string | null;
  footer_logo_url: string | null;
  footer_copyright_text: string;
  footer_event_info: string;
  created_at: string;
  updated_at: string;
}

export function LogoFooterManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [form, setForm] = useState({
    header_logo_url: "",
    footer_logo_url: "",
    footer_copyright_text: "",
    footer_event_info: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("branding_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setSettings(data);
        setForm({
          header_logo_url: data.header_logo_url || "",
          footer_logo_url: data.footer_logo_url || "",
          footer_copyright_text: data.footer_copyright_text || "",
          footer_event_info: data.footer_event_info || "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "header_logo_url" | "footer_logo_url") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `branding/${field}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("cms-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("cms-images")
        .getPublicUrl(fileName);

      setForm({ ...form, [field]: data.publicUrl });
      toast({ title: "Uploaded!", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (settings?.id) {
        const { error } = await supabase
          .from("branding_settings")
          .update({
            header_logo_url: form.header_logo_url,
            footer_logo_url: form.footer_logo_url,
            footer_copyright_text: form.footer_copyright_text,
            footer_event_info: form.footer_event_info,
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("branding_settings")
          .insert([
            {
              header_logo_url: form.header_logo_url,
              footer_logo_url: form.footer_logo_url,
              footer_copyright_text: form.footer_copyright_text,
              footer_event_info: form.footer_event_info,
            },
          ]);

        if (error) throw error;
      }

      toast({ title: "Success", description: "Branding settings saved" });
      loadSettings();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Header Logo</CardTitle>
          <CardDescription>Logo displayed in the navigation bar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Header Logo URL</Label>
            <div className="flex items-center gap-4">
              <Input
                value={form.header_logo_url}
                onChange={(e) => setForm({ ...form, header_logo_url: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading === "header_logo_url"}
                  asChild
                >
                  <span>
                    {uploading === "header_logo_url" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "header_logo_url")}
                />
              </label>
            </div>
            {form.header_logo_url && (
              <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-center">
                <img src={form.header_logo_url} alt="Header Logo" className="h-12 max-w-xs object-contain" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Logo</CardTitle>
          <CardDescription>Logo displayed in the footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Footer Logo URL</Label>
            <div className="flex items-center gap-4">
              <Input
                value={form.footer_logo_url}
                onChange={(e) => setForm({ ...form, footer_logo_url: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading === "footer_logo_url"}
                  asChild
                >
                  <span>
                    {uploading === "footer_logo_url" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </span>
                </Button>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "footer_logo_url")}
                />
              </label>
            </div>
            {form.footer_logo_url && (
              <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-center">
                <img src={form.footer_logo_url} alt="Footer Logo" className="h-12 max-w-xs object-contain" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Copyright */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Copyright Text</CardTitle>
          <CardDescription>Copyright notice displayed at the bottom of footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Copyright Text</Label>
            <Textarea
              value={form.footer_copyright_text}
              onChange={(e) => setForm({ ...form, footer_copyright_text: e.target.value })}
              placeholder="© 2026 Startup & Innovation Spring Festival. All rights reserved."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Example: © 2026 Startup & Innovation Spring Festival. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Event Info */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Event Info</CardTitle>
          <CardDescription>Event date and location displayed in footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Event Info</Label>
            <Textarea
              value={form.footer_event_info}
              onChange={(e) => setForm({ ...form, footer_event_info: e.target.value })}
              placeholder="April 15-17, 2026 • Innovation Hub, Singapore"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Example: April 15-17, 2026 • Innovation Hub, Singapore
            </p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" variant="hero" disabled={submitting}>
        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Branding Settings
      </Button>
    </form>
  );
}
