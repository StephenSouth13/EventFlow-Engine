import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PageConfig {
  id: string;
  page_slug: string;
  page_title: string;
  page_description: string;
  is_visible: boolean;
  sections_enabled: string; // JSON array
  custom_content: string | null;
  created_at: string;
  updated_at: string;
}

const PAGES = [
  { slug: "home", label: "Trang chủ", sections: ["hero", "stats", "features", "cta"] },
  { slug: "about", label: "Giới thiệu", sections: ["about-content", "team", "mission"] },
  { slug: "schedule", label: "Lịch trình", sections: ["schedule-header", "schedule-items"] },
  { slug: "speakers", label: "Diễn giả", sections: ["speakers-header", "speakers-list"] },
  { slug: "startups", label: "Startups", sections: ["startups-header", "startups-list"] },
  { slug: "venue", label: "Địa điểm", sections: ["venue-info", "venue-map", "hotels"] },
  { slug: "faq", label: "FAQ", sections: ["faq-header", "faq-items"] },
  { slug: "contact", label: "Liên hệ", sections: ["contact-form", "contact-info"] },
];

export function PageContentManager() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
  const [pages, setPages] = useState<Record<string, PageConfig | null>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    page_title: "",
    page_description: "",
    is_visible: true,
    sections_enabled: [] as string[],
    custom_content: "",
  });

  useEffect(() => {
    loadAllPages();
  }, []);

  useEffect(() => {
    loadPageConfig();
  }, [selectedPage]);

  const loadAllPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("page_configs")
        .select("*");

      if (error && error.code !== "PGRST116") throw error;

      const pagesMap: Record<string, PageConfig | null> = {};
      PAGES.forEach((page) => {
        pagesMap[page.slug] = null;
      });

      if (data) {
        data.forEach((config) => {
          pagesMap[config.page_slug] = config;
        });
      }

      setPages(pagesMap);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadPageConfig = async () => {
    try {
      const pageSlug = selectedPage;
      const pageConfig = pages[pageSlug];

      if (pageConfig) {
        const sectionsEnabled = JSON.parse(pageConfig.sections_enabled || "[]");
        setForm({
          page_title: pageConfig.page_title || "",
          page_description: pageConfig.page_description || "",
          is_visible: pageConfig.is_visible,
          sections_enabled: sectionsEnabled,
          custom_content: pageConfig.custom_content || "",
        });
      } else {
        const defaultPage = PAGES.find((p) => p.slug === pageSlug);
        setForm({
          page_title: defaultPage?.label || "",
          page_description: "",
          is_visible: true,
          sections_enabled: defaultPage?.sections || [],
          custom_content: "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const pageConfig = pages[selectedPage];
      const sectionsJson = JSON.stringify(form.sections_enabled);

      if (pageConfig) {
        const { error } = await supabase
          .from("page_configs")
          .update({
            page_title: form.page_title,
            page_description: form.page_description,
            is_visible: form.is_visible,
            sections_enabled: sectionsJson,
            custom_content: form.custom_content,
          })
          .eq("id", pageConfig.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("page_configs")
          .insert([
            {
              page_slug: selectedPage,
              page_title: form.page_title,
              page_description: form.page_description,
              is_visible: form.is_visible,
              sections_enabled: sectionsJson,
              custom_content: form.custom_content,
            },
          ]);

        if (error) throw error;
      }

      toast({ title: "Success", description: "Page configuration saved" });
      loadAllPages();
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

  const currentPageDef = PAGES.find((p) => p.slug === selectedPage);
  const currentPageConfig = pages[selectedPage];

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Page to Edit</CardTitle>
          <CardDescription>Choose which page you want to configure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PAGES.map((page) => (
              <Button
                key={page.slug}
                variant={selectedPage === page.slug ? "default" : "outline"}
                onClick={() => setSelectedPage(page.slug)}
                className="justify-start"
              >
                {currentPageConfig?.page_slug === page.slug && currentPageConfig?.is_visible ? (
                  <Eye className="w-4 h-4 mr-2" />
                ) : (
                  <EyeOff className="w-4 h-4 mr-2" />
                )}
                {page.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Configuration */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Page Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={form.page_title}
                onChange={(e) => setForm({ ...form, page_title: e.target.value })}
                placeholder="Page title"
              />
            </div>

            <div className="space-y-2">
              <Label>Page Description</Label>
              <Textarea
                value={form.page_description}
                onChange={(e) => setForm({ ...form, page_description: e.target.value })}
                placeholder="Brief description of this page"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                  className="rounded"
                />
                Page Visible (Show on website)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Sections Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Page Sections</CardTitle>
            <CardDescription>Enable or disable sections for this page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {currentPageDef?.sections.map((section) => (
                <Label
                  key={section}
                  className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={form.sections_enabled.includes(section)}
                    onChange={() => toggleSection(section)}
                    className="rounded"
                  />
                  <span className="capitalize">{section.replace("-", " ")}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Content */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Content</CardTitle>
            <CardDescription>Additional HTML or text for this page (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={form.custom_content}
              onChange={(e) => setForm({ ...form, custom_content: e.target.value })}
              placeholder="Additional content or HTML"
              rows={6}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Button type="submit" variant="hero" disabled={submitting}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Page Configuration
        </Button>
      </form>
    </div>
  );
}
