import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Check, X, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

const AVAILABLE_PLATFORMS = [
  { name: "Twitter", icon: "Twitter" },
  { name: "LinkedIn", icon: "Linkedin" },
  { name: "Instagram", icon: "Instagram" },
  { name: "YouTube", icon: "Youtube" },
  { name: "Facebook", icon: "Facebook" },
  { name: "TikTok", icon: "TikTok" },
  { name: "GitHub", icon: "Github" },
  { name: "Discord", icon: "MessageCircle" },
];

export function SocialLinksManager() {
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    platform: "",
    url: "",
    icon_name: "",
  });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.platform || !form.url || !form.icon_name) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("social_links")
          .update({
            platform: form.platform,
            url: form.url,
            icon_name: form.icon_name,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Social link updated" });
      } else {
        const maxOrder = links.length > 0 ? Math.max(...links.map((l) => l.sort_order), 0) : 0;
        const { error } = await supabase
          .from("social_links")
          .insert([
            {
              platform: form.platform,
              url: form.url,
              icon_name: form.icon_name,
              sort_order: maxOrder + 1,
              is_visible: true,
            },
          ]);

        if (error) throw error;
        toast({ title: "Success", description: "Social link added" });
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ platform: "", url: "", icon_name: "" });
      loadLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (link: SocialLink) => {
    setForm({
      platform: link.platform,
      url: link.url,
      icon_name: link.icon_name,
    });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from("social_links")
        .update({ is_visible: !isVisible })
        .eq("id", id);

      if (error) throw error;
      loadLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    try {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Social link deleted" });
      loadLinks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Social Link" : "Add Social Link"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <select
                  value={form.platform}
                  onChange={(e) => {
                    const platform = e.target.value;
                    const iconName = AVAILABLE_PLATFORMS.find((p) => p.name === platform)?.icon || "";
                    setForm({ ...form, platform, icon_name: iconName });
                  }}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Select Platform</option>
                  {AVAILABLE_PLATFORMS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://twitter.com/..."
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ platform: "", url: "", icon_name: "" });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </Button>
      )}

      <div className="grid gap-4">
        {links.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No social links yet. Add your first social media link.
            </CardContent>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{link.platform}</h3>
                  <p className="text-sm text-muted-foreground break-all">{link.url}</p>
                  <p className="text-xs text-muted-foreground mt-1">Icon: {link.icon_name}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleVisibility(link.id, link.is_visible)}
                    title={link.is_visible ? "Hide" : "Show"}
                  >
                    {link.is_visible ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(link)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
