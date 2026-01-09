import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Check, X, Loader2, Globe, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  slug: string;
}

interface DomainMapping {
  id: string;
  template_id: string;
  domain: string;
  subdomain?: string;
  is_active: boolean;
  ssl_enabled: boolean;
  created_at: string;
  updated_at: string;
  templates?: {
    name: string;
    slug: string;
  };
}

export function DomainManager() {
  const { toast } = useToast();
  const [domains, setDomains] = useState<DomainMapping[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    template_id: "",
    domain: "",
    subdomain: "",
    is_active: true,
    ssl_enabled: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [domainsRes, templatesRes] = await Promise.all([
        supabase
          .from("template_domains")
          .select("*, templates!inner(name, slug)")
          .order("created_at", { ascending: false }),
        supabase
          .from("templates")
          .select("id, name, slug")
          .is("deleted_at", null),
      ]);

      if (domainsRes.error) throw domainsRes.error;
      if (templatesRes.error) throw templatesRes.error;

      setDomains(domainsRes.data || []);
      setTemplates(templatesRes.data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const buildFullDomain = (domain: string, subdomain: string) => {
    if (subdomain) {
      return `${subdomain}.${domain}`;
    }
    return domain;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.template_id) {
      toast({ title: "Error", description: "Please select a template", variant: "destructive" });
      return;
    }

    if (!form.domain) {
      toast({ title: "Error", description: "Please enter a domain", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const fullDomain = buildFullDomain(form.domain, form.subdomain);

      if (editingId) {
        const { error } = await supabase
          .from("template_domains")
          .update({
            template_id: form.template_id,
            domain: form.domain,
            subdomain: form.subdomain || null,
            is_active: form.is_active,
            ssl_enabled: form.ssl_enabled,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Success", description: "Domain mapping updated" });
      } else {
        const { error } = await supabase
          .from("template_domains")
          .insert([
            {
              template_id: form.template_id,
              domain: fullDomain,
              subdomain: form.subdomain || null,
              is_active: form.is_active,
              ssl_enabled: form.ssl_enabled,
            },
          ]);

        if (error) throw error;
        toast({ title: "Success", description: "Domain mapping created" });
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ template_id: "", domain: "", subdomain: "", is_active: true, ssl_enabled: true });
      loadData();
    } catch (error: any) {
      if (error.code === "23505") {
        toast({ title: "Error", description: "This domain is already mapped", variant: "destructive" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (domain: DomainMapping) => {
    const fullDomain = domain.domain;
    const parts = fullDomain.split(".");
    let subdomain = "";
    let baseDomain = fullDomain;

    if (parts.length > 2) {
      subdomain = parts[0];
      baseDomain = parts.slice(1).join(".");
    }

    const template = templates.find((t) => t.id === domain.template_id);
    setForm({
      template_id: domain.template_id,
      domain: baseDomain,
      subdomain: subdomain,
      is_active: domain.is_active,
      ssl_enabled: domain.ssl_enabled,
    });
    setEditingId(domain.id);
    setShowForm(true);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("template_domains")
        .update({ is_active: !isActive, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this domain mapping?")) return;

    try {
      const { error } = await supabase
        .from("template_domains")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Domain mapping deleted" });
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCopyDomain = (domain: string) => {
    navigator.clipboard.writeText(`https://${domain}`);
    toast({ title: "Copied", description: `https://${domain}` });
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
            <CardTitle>{editingId ? "Edit Domain Mapping" : "Create Domain Mapping"}</CardTitle>
            <CardDescription>
              Map a domain/subdomain to a template. Example: festival.learnforgrowth.com.vn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Select Template *</Label>
                  <Select value={form.template_id} onValueChange={(value) => setForm({ ...form, template_id: value })}>
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
                </div>

                <div className="space-y-2">
                  <Label>Base Domain *</Label>
                  <Input
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    placeholder="learnforgrowth.com.vn"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Without subdomain prefix</p>
                </div>

                <div className="space-y-2">
                  <Label>Subdomain (optional)</Label>
                  <Input
                    value={form.subdomain}
                    onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
                    placeholder="festival"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for root domain</p>
                </div>

                {form.domain && (
                  <div className="md:col-span-2 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Full domain:</p>
                    <p className="font-mono text-sm font-semibold">
                      {buildFullDomain(form.domain, form.subdomain)}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="rounded"
                    />
                    Active
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.ssl_enabled}
                      onChange={(e) => setForm({ ...form, ssl_enabled: e.target.checked })}
                      className="rounded"
                    />
                    SSL Enabled
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ template_id: "", domain: "", subdomain: "", is_active: true, ssl_enabled: true });
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
          New Domain Mapping
        </Button>
      )}

      {/* Domains List */}
      <div className="grid gap-4">
        {domains.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No domain mappings yet. Create your first mapping to get started.
            </CardContent>
          </Card>
        ) : (
          domains.map((domain) => (
            <Card key={domain.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-primary" />
                      <code className="font-mono font-semibold text-base">{domain.domain}</code>
                      <span className="text-xs">
                        {domain.is_active ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                        )}
                      </span>
                      {domain.ssl_enabled && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">SSL</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Template:</span>{" "}
                        <span className="font-medium">{domain.templates?.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(domain.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={domain.is_active ? "outline" : "secondary"}
                      onClick={() => handleToggleActive(domain.id, domain.is_active)}
                    >
                      {domain.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyDomain(domain.domain)}
                      title="Copy domain"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(domain)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => handleDelete(domain.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
