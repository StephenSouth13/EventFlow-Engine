import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Rocket, CheckCircle, XCircle, Globe, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Startup {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  industry: string | null;
  stage: string | null;
  funding_status: string | null;
  team_size: string | null;
  track: string | null;
  pitch_deck_url: string | null;
  video_url: string | null;
  is_approved: boolean;
  user_id: string;
}

const industries = [
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS" },
  { value: "ai", label: "AI/ML" },
  { value: "iot", label: "IoT" },
  { value: "cleantech", label: "CleanTech" },
  { value: "agritech", label: "AgriTech" },
  { value: "logistics", label: "Logistics" },
  { value: "other", label: "Khác" },
];

const stages = [
  { value: "idea", label: "Ý tưởng" },
  { value: "mvp", label: "MVP" },
  { value: "early", label: "Early Stage" },
  { value: "growth", label: "Growth" },
  { value: "scale", label: "Scale-up" },
];

const fundingStatuses = [
  { value: "bootstrapped", label: "Bootstrapped" },
  { value: "pre-seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B+" },
];

const tracks = [
  { value: "general", label: "General" },
  { value: "fintech", label: "Fintech" },
  { value: "impact", label: "Social Impact" },
  { value: "deeptech", label: "Deep Tech" },
];

export function StartupsManager() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Startup>>({});

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("startups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStartups(data || []);
    } catch (error: any) {
      toast.error("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên startup");
      return;
    }

    try {
      const { error } = await supabase
        .from("startups")
        .update({
          name: formData.name,
          tagline: formData.tagline,
          description: formData.description,
          logo_url: formData.logo_url,
          website_url: formData.website_url,
          industry: formData.industry,
          stage: formData.stage,
          funding_status: formData.funding_status,
          team_size: formData.team_size,
          track: formData.track,
          pitch_deck_url: formData.pitch_deck_url,
          video_url: formData.video_url,
          is_approved: formData.is_approved,
        })
        .eq("id", editingId);

      if (error) throw error;
      toast.success("Đã cập nhật startup");
      resetForm();
      fetchStartups();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa startup này?")) return;

    try {
      const { error } = await supabase.from("startups").delete().eq("id", id);
      if (error) throw error;
      toast.success("Đã xóa startup");
      fetchStartups();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const toggleApproval = async (startup: Startup) => {
    try {
      const { error } = await supabase
        .from("startups")
        .update({ is_approved: !startup.is_approved })
        .eq("id", startup.id);

      if (error) throw error;
      toast.success(startup.is_approved ? "Đã ẩn startup" : "Đã duyệt startup");
      fetchStartups();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const startEdit = (startup: Startup) => {
    setEditingId(startup.id);
    setFormData({
      name: startup.name,
      tagline: startup.tagline || "",
      description: startup.description || "",
      logo_url: startup.logo_url || "",
      website_url: startup.website_url || "",
      industry: startup.industry || "",
      stage: startup.stage || "",
      funding_status: startup.funding_status || "",
      team_size: startup.team_size || "",
      track: startup.track || "",
      pitch_deck_url: startup.pitch_deck_url || "",
      video_url: startup.video_url || "",
      is_approved: startup.is_approved,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Form */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Chỉnh sửa Startup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên Startup *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline || ""}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Mô tả ngắn gọn"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">URL Logo</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url || ""}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url || ""}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Ngành</Label>
                    <Select
                      value={formData.industry || ""}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngành" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((i) => (
                          <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Giai đoạn</Label>
                    <Select
                      value={formData.stage || ""}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giai đoạn" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding_status">Vốn</Label>
                    <Select
                      value={formData.funding_status || ""}
                      onValueChange={(value) => setFormData({ ...formData, funding_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStatuses.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="track">Track</Label>
                    <Select
                      value={formData.track || ""}
                      onValueChange={(value) => setFormData({ ...formData, track: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn track" />
                      </SelectTrigger>
                      <SelectContent>
                        {tracks.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pitch_deck_url">Pitch Deck URL</Label>
                    <Input
                      id="pitch_deck_url"
                      value={formData.pitch_deck_url || ""}
                      onChange={(e) => setFormData({ ...formData, pitch_deck_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url || ""}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="is_approved"
                    checked={formData.is_approved}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_approved: checked })}
                  />
                  <Label htmlFor="is_approved">Hiển thị công khai</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Cập nhật
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="gap-2">
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      {!editingId && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              💡 Startups được đăng ký qua form <strong>/apply/startup</strong>. Bạn có thể duyệt hoặc chỉnh sửa thông tin tại đây.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Startups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {startups.length === 0 ? (
          <Card className="border-dashed col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Rocket className="w-12 h-12 mb-4 opacity-50" />
              <p>Chưa có startup nào đăng ký</p>
              <p className="text-sm">Startup sẽ xuất hiện sau khi đăng ký qua form</p>
            </CardContent>
          </Card>
        ) : (
          startups.map((startup) => (
            <motion.div
              key={startup.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 shrink-0 rounded-lg">
                      <AvatarImage src={startup.logo_url || ""} alt={startup.name} className="object-contain" />
                      <AvatarFallback className="bg-primary/10 text-primary rounded-lg">
                        {getInitials(startup.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold truncate">{startup.name}</h3>
                        <Badge variant={startup.is_approved ? "default" : "secondary"}>
                          {startup.is_approved ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Chờ duyệt</>
                          )}
                        </Badge>
                      </div>
                      {startup.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{startup.tagline}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {startup.industry && (
                          <Badge variant="outline" className="text-xs">
                            {industries.find((i) => i.value === startup.industry)?.label || startup.industry}
                          </Badge>
                        )}
                        {startup.stage && (
                          <Badge variant="outline" className="text-xs">
                            {stages.find((s) => s.value === startup.stage)?.label || startup.stage}
                          </Badge>
                        )}
                        {startup.funding_status && (
                          <Badge variant="outline" className="text-xs">
                            {fundingStatuses.find((f) => f.value === startup.funding_status)?.label || startup.funding_status}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {startup.website_url && (
                          <a href={startup.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {startup.pitch_deck_url && (
                          <a href={startup.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleApproval(startup)} title={startup.is_approved ? "Ẩn" : "Duyệt"}>
                        {startup.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(startup)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(startup.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
