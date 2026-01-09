import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Mic, CheckCircle, XCircle, Linkedin, Twitter, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Speaker {
  id: string;
  name: string;
  email: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  is_approved: boolean;
}

export function SpeakersManager() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Speaker>>({
    name: "",
    email: "",
    title: "",
    company: "",
    bio: "",
    photo_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    is_approved: true,
  });

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("speakers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setSpeakers(data || []);
    } catch (error: any) {
      toast.error("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên diễn giả");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("speakers")
          .update({
            name: formData.name,
            email: formData.email,
            title: formData.title,
            company: formData.company,
            bio: formData.bio,
            photo_url: formData.photo_url,
            linkedin_url: formData.linkedin_url,
            twitter_url: formData.twitter_url,
            website_url: formData.website_url,
            is_approved: formData.is_approved,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Đã cập nhật diễn giả");
      } else {
        const { error } = await supabase.from("speakers").insert({
          name: formData.name!,
          email: formData.email,
          title: formData.title,
          company: formData.company,
          bio: formData.bio,
          photo_url: formData.photo_url,
          linkedin_url: formData.linkedin_url,
          twitter_url: formData.twitter_url,
          website_url: formData.website_url,
          is_approved: formData.is_approved ?? true,
        });

        if (error) throw error;
        toast.success("Đã thêm diễn giả mới");
      }

      resetForm();
      fetchSpeakers();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa diễn giả này?")) return;

    try {
      const { error } = await supabase.from("speakers").delete().eq("id", id);
      if (error) throw error;
      toast.success("Đã xóa diễn giả");
      fetchSpeakers();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const toggleApproval = async (speaker: Speaker) => {
    try {
      const { error } = await supabase
        .from("speakers")
        .update({ is_approved: !speaker.is_approved })
        .eq("id", speaker.id);

      if (error) throw error;
      toast.success(speaker.is_approved ? "Đã ẩn diễn giả" : "Đã duyệt diễn giả");
      fetchSpeakers();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const startEdit = (speaker: Speaker) => {
    setEditingId(speaker.id);
    setFormData({
      name: speaker.name,
      email: speaker.email || "",
      title: speaker.title || "",
      company: speaker.company || "",
      bio: speaker.bio || "",
      photo_url: speaker.photo_url || "",
      linkedin_url: speaker.linkedin_url || "",
      twitter_url: speaker.twitter_url || "",
      website_url: speaker.website_url || "",
      is_approved: speaker.is_approved,
    });
    setIsAdding(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: "",
      email: "",
      title: "",
      company: "",
      bio: "",
      photo_url: "",
      linkedin_url: "",
      twitter_url: "",
      website_url: "",
      is_approved: true,
    });
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
      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingId ? "Chỉnh sửa Diễn giả" : "Thêm Diễn giả mới"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ tên *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Chức danh</Label>
                    <Input
                      id="title"
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="CEO, CTO, Founder..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Công ty</Label>
                    <Input
                      id="company"
                      value={formData.company || ""}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Tên công ty"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Tiểu sử</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Giới thiệu ngắn về diễn giả"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo_url">URL Ảnh đại diện</Label>
                  <Input
                    id="photo_url"
                    value={formData.photo_url || ""}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url || ""}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter_url">Twitter</Label>
                    <Input
                      id="twitter_url"
                      value={formData.twitter_url || ""}
                      onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url || ""}
                      onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://example.com"
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
                    {editingId ? "Cập nhật" : "Thêm mới"}
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

      {/* Add Button */}
      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm Diễn giả
        </Button>
      )}

      {/* Speakers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {speakers.length === 0 ? (
          <Card className="border-dashed col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Mic className="w-12 h-12 mb-4 opacity-50" />
              <p>Chưa có diễn giả nào</p>
              <p className="text-sm">Nhấn "Thêm Diễn giả" để tạo mới</p>
            </CardContent>
          </Card>
        ) : (
          speakers.map((speaker) => (
            <motion.div
              key={speaker.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 shrink-0">
                      <AvatarImage src={speaker.photo_url || ""} alt={speaker.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(speaker.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold truncate">{speaker.name}</h3>
                        <Badge variant={speaker.is_approved ? "default" : "secondary"}>
                          {speaker.is_approved ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Chờ duyệt</>
                          )}
                        </Badge>
                      </div>
                      {(speaker.title || speaker.company) && (
                        <p className="text-sm text-muted-foreground">
                          {speaker.title}{speaker.title && speaker.company && " • "}{speaker.company}
                        </p>
                      )}
                      {speaker.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{speaker.bio}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {speaker.linkedin_url && (
                          <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {speaker.twitter_url && (
                          <a href={speaker.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {speaker.website_url && (
                          <a href={speaker.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleApproval(speaker)} title={speaker.is_approved ? "Ẩn" : "Duyệt"}>
                        {speaker.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(speaker)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(speaker.id)}>
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
