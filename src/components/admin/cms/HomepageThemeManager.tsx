import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  gradient_start: string;
  gradient_end: string;
  font_family: string;
  background_pattern: string;
  is_active: boolean;
}

const PRESET_THEMES: Omit<Theme, "id">[] = [
  {
    name: "Ocean Blue",
    slug: "ocean-blue",
    description: "Professional ocean-inspired theme with cool blue tones",
    primary_color: "#0ea5e9",
    secondary_color: "#06b6d4",
    accent_color: "#0891b2",
    gradient_start: "#0ea5e9",
    gradient_end: "#06b6d4",
    font_family: "Inter, system-ui, sans-serif",
    background_pattern: "dots",
    is_active: false,
  },
  {
    name: "Sunset Gold",
    slug: "sunset-gold",
    description: "Warm and energetic theme with golden sunset colors",
    primary_color: "#f59e0b",
    secondary_color: "#f97316",
    accent_color: "#ea580c",
    gradient_start: "#fbbf24",
    gradient_end: "#f97316",
    font_family: "Space Grotesk, Inter, sans-serif",
    background_pattern: "gradient",
    is_active: false,
  },
  {
    name: "Purple Haze",
    slug: "purple-haze",
    description: "Modern and creative purple-pink theme",
    primary_color: "#a855f7",
    secondary_color: "#ec4899",
    accent_color: "#db2777",
    gradient_start: "#c084fc",
    gradient_end: "#f472b6",
    font_family: "Poppins, sans-serif",
    background_pattern: "mesh",
    is_active: false,
  },
  {
    name: "Tech Dark",
    slug: "tech-dark",
    description: "Dark and minimalist tech-focused theme",
    primary_color: "#1f2937",
    secondary_color: "#374151",
    accent_color: "#60a5fa",
    gradient_start: "#1f2937",
    gradient_end: "#374151",
    font_family: "Roboto Mono, monospace",
    background_pattern: "grid",
    is_active: false,
  },
  {
    name: "Green Energy",
    slug: "green-energy",
    description: "Eco-friendly theme with vibrant green tones",
    primary_color: "#10b981",
    secondary_color: "#059669",
    accent_color: "#047857",
    gradient_start: "#34d399",
    gradient_end: "#10b981",
    font_family: "Inter, system-ui, sans-serif",
    background_pattern: "dots",
    is_active: false,
  },
  {
    name: "Pink Blossom",
    slug: "pink-blossom",
    description: "Elegant and soft pink theme",
    primary_color: "#ec4899",
    secondary_color: "#f472b6",
    accent_color: "#db2777",
    gradient_start: "#fbcfe8",
    gradient_end: "#f472b6",
    font_family: "Playfair Display, serif",
    background_pattern: "gradient",
    is_active: false,
  },
  {
    name: "Neon Cyberpunk",
    slug: "neon-cyberpunk",
    description: "Bold cyberpunk-inspired theme with neon colors",
    primary_color: "#ff006e",
    secondary_color: "#00f5ff",
    accent_color: "#ffbe0b",
    gradient_start: "#ff006e",
    gradient_end: "#00f5ff",
    font_family: "Space Grotesk, Inter, sans-serif",
    background_pattern: "mesh",
    is_active: false,
  },
  {
    name: "Forest Deep",
    slug: "forest-deep",
    description: "Deep forest green with earthy tones",
    primary_color: "#15803d",
    secondary_color: "#1e7e34",
    accent_color: "#f59e0b",
    gradient_start: "#22c55e",
    gradient_end: "#15803d",
    font_family: "Montserrat, sans-serif",
    background_pattern: "dots",
    is_active: false,
  },
  {
    name: "Coral Reef",
    slug: "coral-reef",
    description: "Tropical and vibrant coral theme",
    primary_color: "#f97316",
    secondary_color: "#fb923c",
    accent_color: "#fed7aa",
    gradient_start: "#fb923c",
    gradient_end: "#fbbf24",
    font_family: "Poppins, sans-serif",
    background_pattern: "gradient",
    is_active: false,
  },
  {
    name: "Midnight Indigo",
    slug: "midnight-indigo",
    description: "Deep indigo night theme",
    primary_color: "#4f46e5",
    secondary_color: "#6366f1",
    accent_color: "#818cf8",
    gradient_start: "#4f46e5",
    gradient_end: "#6366f1",
    font_family: "Inter, system-ui, sans-serif",
    background_pattern: "grid",
    is_active: false,
  },
];

export function HomepageThemeManager() {
  const { toast } = useToast();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [customizing, setCustomizing] = useState<Theme | null>(null);
  const [editingTheme, setEditingTheme] = useState({
    primary_color: "",
    secondary_color: "",
    accent_color: "",
  });

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("homepage_themes")
        .select("*")
        .order("slug");

      if (error && error.code !== "PGRST116") throw error;

      if (data && data.length > 0) {
        setThemes(data);
        const active = data.find((t) => t.is_active);
        if (active) setActiveTheme(active);
      } else {
        // Initialize with presets if no themes exist
        const { error: insertError } = await supabase
          .from("homepage_themes")
          .insert(
            PRESET_THEMES.map((theme) => ({
              ...theme,
              is_active: false,
            }))
          );

        if (insertError) throw insertError;
        loadThemes(); // Reload after insert
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTheme = async (theme: Theme) => {
    try {
      setSubmitting(true);

      // Deactivate all themes
      const { error: deactivateError } = await supabase
        .from("homepage_themes")
        .update({ is_active: false })
        .neq("id", theme.id);

      if (deactivateError) throw deactivateError;

      // Activate selected theme
      const { error: activateError } = await supabase
        .from("homepage_themes")
        .update({ is_active: true })
        .eq("id", theme.id);

      if (activateError) throw activateError;

      toast({ title: "Success", description: `${theme.name} theme activated` });
      loadThemes();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomizeTheme = (theme: Theme) => {
    setCustomizing(theme);
    setEditingTheme({
      primary_color: theme.primary_color,
      secondary_color: theme.secondary_color,
      accent_color: theme.accent_color,
    });
  };

  const handleSaveCustomization = async () => {
    if (!customizing) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("homepage_themes")
        .update({
          primary_color: editingTheme.primary_color,
          secondary_color: editingTheme.secondary_color,
          accent_color: editingTheme.accent_color,
        })
        .eq("id", customizing.id);

      if (error) throw error;

      toast({ title: "Success", description: "Theme customized" });
      setCustomizing(null);
      loadThemes();
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
    <div className="space-y-6">
      {/* Customization Panel */}
      {customizing && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Customize {customizing.name}</CardTitle>
            <CardDescription>Adjust colors for this theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingTheme.primary_color}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        primary_color: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingTheme.primary_color}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        primary_color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingTheme.secondary_color}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        secondary_color: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingTheme.secondary_color}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        secondary_color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={editingTheme.accent_color}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        accent_color: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingTheme.accent_color}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        accent_color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCustomizing(null)}>
                Cancel
              </Button>
              <Button
                variant="hero"
                onClick={handleSaveCustomization}
                disabled={submitting}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Customization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Theme Display */}
      {activeTheme && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Active Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-semibold">{activeTheme.name}</h3>
                <p className="text-sm text-muted-foreground">{activeTheme.description}</p>
                <div className="flex gap-2 mt-2">
                  <div
                    className="w-8 h-8 rounded border-2 border-foreground"
                    style={{ backgroundColor: activeTheme.primary_color }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded border-2 border-foreground"
                    style={{ backgroundColor: activeTheme.secondary_color }}
                    title="Secondary"
                  />
                  <div
                    className="w-8 h-8 rounded border-2 border-foreground"
                    style={{ backgroundColor: activeTheme.accent_color }}
                    title="Accent"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleCustomizeTheme(activeTheme)}
              >
                Customize
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Gallery */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Themes (10 Presets)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all ${
                activeTheme?.id === theme.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </div>
                  {activeTheme?.id === theme.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>

                {/* Color Palette Preview */}
                <div className="flex gap-2 mb-4">
                  <div
                    className="flex-1 h-12 rounded"
                    style={{ backgroundColor: theme.primary_color }}
                    title="Primary"
                  />
                  <div
                    className="flex-1 h-12 rounded"
                    style={{ backgroundColor: theme.secondary_color }}
                    title="Secondary"
                  />
                  <div
                    className="flex-1 h-12 rounded"
                    style={{ backgroundColor: theme.accent_color }}
                    title="Accent"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {activeTheme?.id !== theme.id && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleActivateTheme(theme)}
                      disabled={submitting}
                      className="flex-1"
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCustomizeTheme(theme)}
                    className="flex-1"
                  >
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
