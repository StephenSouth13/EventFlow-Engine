import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Copy, Trash2, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_default: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function TemplatesManager() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    is_public: false,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: generateSlug(name) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("templates")
          .update({
            name: form.name,
            slug: form.slug,
            description: form.description,
            is_public: form.is_public,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Template updated" });
      } else {
        const { error } = await supabase
          .from("templates")
          .insert([
            {
              name: form.name,
              slug: form.slug,
              description: form.description,
              is_public: form.is_public,
              is_default: templates.length === 0,
            },
          ]);

        if (error) throw error;
        toast({ title: "Success", description: "Template created" });
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", slug: "", description: "", is_public: false });
      loadTemplates();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (template: Template) => {
    setForm({
      name: template.name,
      slug: template.slug,
      description: template.description || "",
      is_public: template.is_public,
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDuplicate = async (template: Template) => {
    try {
      setSubmitting(true);
      const newSlug = `${template.slug}-copy-${Date.now()}`;
      const { error } = await supabase
        .from("templates")
        .insert([
          {
            name: `${template.name} (Copy)`,
            slug: newSlug,
            description: template.description,
            is_public: template.is_public,
            is_default: false,
          },
        ]);

      if (error) throw error;
      toast({ title: "Success", description: "Template duplicated" });
      loadTemplates();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const { error } = await supabase
        .from("templates")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Template deleted" });
      loadTemplates();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from("templates")
        .update({ is_default: false })
        .eq("is_default", true);

      if (updateError) throw updateError;

      const { error } = await supabase
        .from("templates")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Default template updated" });
      loadTemplates();
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
      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Template" : "Create New Template"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Spring Festival 2026"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="spring-festival-2026"
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of this template"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_public}
                      onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                      className="rounded"
                    />
                    Public Template
                  </Label>
                  <p className="text-xs text-muted-foreground">Allow others to duplicate this template</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ name: "", slug: "", description: "", is_public: false });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="hero">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      )}

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No templates yet. Create your first template to get started.
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  {template.is_default && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  {template.is_public && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      Public
                    </span>
                  )}
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">Slug: {template.slug}</p>
              </div>

              <div className="flex gap-2 ml-4">
                {!template.is_default && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetDefault(template.id)}
                    title="Set as default"
                  >
                    ✓
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(template)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDuplicate(template)}
                  disabled={submitting}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
