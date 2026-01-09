import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  slug: string;
}

interface TemplateConfig {
  id: string;
  template_id: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_family?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  sections_enabled?: string;
  custom_css?: string;
}

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Space Grotesk", value: "Space Grotesk, Inter, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
];

const AVAILABLE_SECTIONS = [
  { id: "hero", label: "Hero Section" },
  { id: "stats", label: "Statistics" },
  { id: "features", label: "Features" },
  { id: "cta", label: "Call to Action" },
  { id: "footer", label: "Footer" },
  { id: "speakers", label: "Speakers" },
  { id: "schedule", label: "Schedule" },
  { id: "startups", label: "Startups" },
];

export function TemplateConfigEditor() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    event_title: "",
    event_date: "",
    event_location: "",
    primary_color: "#3b82f6",
    secondary_color: "#8b5cf6",
    accent_color: "#ec4899",
    font_family: "Inter, system-ui, sans-serif",
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    sections_enabled: AVAILABLE_SECTIONS.map((s) => s.id),
    custom_css: "",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateConfig();
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("id, name, slug")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
      if (data && data.length > 0) {
        setSelectedTemplate(data[0].id);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const loadTemplateConfig = async () => {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from("template_configs")
        .select("*")
        .eq("template_id", selectedTemplate)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setConfig(data);
        const sectionsEnabled = data.sections_enabled
          ? JSON.parse(data.sections_enabled)
          : AVAILABLE_SECTIONS.map((s) => s.id);
        setForm({
          event_title: data.event_title || "",
          event_date: data.event_date || "",
          event_location: data.event_location || "",
          primary_color: data.primary_color || "#3b82f6",
          secondary_color: data.secondary_color || "#8b5cf6",
          accent_color: data.accent_color || "#ec4899",
          font_family: data.font_family || "Inter, system-ui, sans-serif",
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          hero_image_url: data.hero_image_url || "",
          sections_enabled: sectionsEnabled,
          custom_css: data.custom_css || "",
        });
      } else {
        setForm({
          event_title: "",
          event_date: "",
          event_location: "",
          primary_color: "#3b82f6",
          secondary_color: "#8b5cf6",
          accent_color: "#ec4899",
          font_family: "Inter, system-ui, sans-serif",
          hero_title: "",
          hero_subtitle: "",
          hero_image_url: "",
          sections_enabled: AVAILABLE_SECTIONS.map((s) => s.id),
          custom_css: "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) {
      toast({ title: "Error", description: "Please select a template", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const sectionsJson = JSON.stringify(form.sections_enabled);

      if (config?.id) {
        const { error } = await supabase
          .from("template_configs")
          .update({
            event_title: form.event_title,
            event_date: form.event_date,
            event_location: form.event_location,
            primary_color: form.primary_color,
            secondary_color: form.secondary_color,
            accent_color: form.accent_color,
            font_family: form.font_family,
            hero_title: form.hero_title,
            hero_subtitle: form.hero_subtitle,
            hero_image_url: form.hero_image_url,
            sections_enabled: sectionsJson,
            custom_css: form.custom_css,
            updated_at: new Date().toISOString(),
          })
          .eq("id", config.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("template_configs")
          .insert([
            {
              template_id: selectedTemplate,
              event_title: form.event_title,
              event_date: form.event_date,
              event_location: form.event_location,
              primary_color: form.primary_color,
              secondary_color: form.secondary_color,
              accent_color: form.accent_color,
              font_family: form.font_family,
              hero_title: form.hero_title,
              hero_subtitle: form.hero_subtitle,
              hero_image_url: form.hero_image_url,
              sections_enabled: sectionsJson,
              custom_css: form.custom_css,
            },
          ]);

        if (error) throw error;
      }

      toast({ title: "Success", description: "Configuration saved" });
      loadTemplateConfig();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setForm({
      ...form,
      sections_enabled: form.sections_enabled.includes(sectionId)
        ? form.sections_enabled.filter((s) => s !== sectionId)
        : [...form.sections_enabled, sectionId],
    });
  };

  if (loading && selectedTemplate) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Template</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({t.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="custom">Custom CSS</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                  <CardDescription>Basic event details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input
                      value={form.event_title}
                      onChange={(e) => setForm({ ...form, event_title: e.target.value })}
                      placeholder="e.g., Startup & Innovation Spring Festival 2026"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event Date</Label>
                      <Input
                        type="date"
                        value={form.event_date}
                        onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Event Location</Label>
                      <Input
                        value={form.event_location}
                        onChange={(e) => setForm({ ...form, event_location: e.target.value })}
                        placeholder="e.g., Ho Chi Minh City, Vietnam"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input
                      value={form.hero_title}
                      onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                      placeholder="Main headline on homepage"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Textarea
                      value={form.hero_subtitle}
                      onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                      placeholder="Supporting text for hero section"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Image URL</Label>
                    <Input
                      value={form.hero_image_url}
                      onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle>Design & Colors</CardTitle>
                  <CardDescription>Customize colors and typography</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select value={form.font_family} onValueChange={(value) => setForm({ ...form, font_family: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Primary Color
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: form.primary_color }}
                        />
                      </Label>
                      <Input
                        type="color"
                        value={form.primary_color}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Secondary Color
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: form.secondary_color }}
                        />
                      </Label>
                      <Input
                        type="color"
                        value={form.secondary_color}
                        onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Accent Color
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: form.accent_color }}
                        />
                      </Label>
                      <Input
                        type="color"
                        value={form.accent_color}
                        onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections">
              <Card>
                <CardHeader>
                  <CardTitle>Enable/Disable Sections</CardTitle>
                  <CardDescription>Choose which sections to display on the homepage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {AVAILABLE_SECTIONS.map((section) => (
                      <Label key={section.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={form.sections_enabled.includes(section.id)}
                          onChange={() => toggleSection(section.id)}
                          className="rounded"
                        />
                        {section.label}
                      </Label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom CSS Tab */}
            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Custom CSS</CardTitle>
                  <CardDescription>Add custom CSS rules (advanced)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Label>CSS Code</Label>
                  <Textarea
                    value={form.custom_css}
                    onChange={(e) => setForm({ ...form, custom_css: e.target.value })}
                    placeholder={`.hero-section {
  background: linear-gradient(to right, #667eea, #764ba2);
}

.button-primary {
  border-radius: 8px;
}`}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button type="submit" variant="hero" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Configuration
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
