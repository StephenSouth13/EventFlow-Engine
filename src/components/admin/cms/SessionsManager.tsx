import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Clock, MapPin, Users, Calendar, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Session {
  id: string;
  title: string;
  description: string | null;
  session_type: string;
  start_time: string;
  end_time: string;
  location: string | null;
  track: string | null;
  max_capacity: number | null;
}

interface Speaker {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
}

const sessionTypes = [
  { value: "talk", label: "Bài thuyết trình" },
  { value: "workshop", label: "Workshop" },
  { value: "panel", label: "Panel Discussion" },
  { value: "keynote", label: "Keynote" },
  { value: "networking", label: "Networking" },
  { value: "break", label: "Giải lao" },
];

const tracks = [
  { value: "main", label: "Main Stage" },
  { value: "tech", label: "Tech Track" },
  { value: "business", label: "Business Track" },
  { value: "investor", label: "Investor Track" },
  { value: "startup", label: "Startup Track" },
];

export function SessionsManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sessionSpeakers, setSessionSpeakers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Session>>({
    title: "",
    description: "",
    session_type: "talk",
    start_time: "",
    end_time: "",
    location: "",
    track: "main",
    max_capacity: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, speakersRes, sessionSpeakersRes] = await Promise.all([
        supabase.from("sessions").select("*").order("start_time", { ascending: true }),
        supabase.from("speakers").select("id, name, title, company").eq("is_approved", true),
        supabase.from("session_speakers").select("session_id, speaker_id"),
      ]);

      if (sessionsRes.error) throw sessionsRes.error;
      if (speakersRes.error) throw speakersRes.error;
      if (sessionSpeakersRes.error) throw sessionSpeakersRes.error;

      setSessions(sessionsRes.data || []);
      setSpeakers(speakersRes.data || []);

      // Map session speakers
      const speakerMap: Record<string, string[]> = {};
      sessionSpeakersRes.data?.forEach((ss) => {
        if (!speakerMap[ss.session_id]) speakerMap[ss.session_id] = [];
        speakerMap[ss.session_id].push(ss.speaker_id);
      });
      setSessionSpeakers(speakerMap);
    } catch (error: any) {
      toast.error("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("sessions")
          .update({
            title: formData.title,
            description: formData.description,
            session_type: formData.session_type,
            start_time: formData.start_time,
            end_time: formData.end_time,
            location: formData.location,
            track: formData.track,
            max_capacity: formData.max_capacity,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Đã cập nhật session");
      } else {
        const { error } = await supabase.from("sessions").insert({
          title: formData.title!,
          description: formData.description,
          session_type: formData.session_type || "talk",
          start_time: formData.start_time!,
          end_time: formData.end_time!,
          location: formData.location,
          track: formData.track,
          max_capacity: formData.max_capacity,
        });

        if (error) throw error;
        toast.success("Đã thêm session mới");
      }

      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa session này?")) return;

    try {
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (error) throw error;
      toast.success("Đã xóa session");
      fetchData();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const startEdit = (session: Session) => {
    setEditingId(session.id);
    setFormData({
      title: session.title,
      description: session.description || "",
      session_type: session.session_type,
      start_time: session.start_time.slice(0, 16),
      end_time: session.end_time.slice(0, 16),
      location: session.location || "",
      track: session.track || "main",
      max_capacity: session.max_capacity,
    });
    setIsAdding(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      title: "",
      description: "",
      session_type: "talk",
      start_time: "",
      end_time: "",
      location: "",
      track: "main",
      max_capacity: null,
    });
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
                  {editingId ? "Chỉnh sửa Session" : "Thêm Session mới"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Tên session"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session_type">Loại session</Label>
                    <Select
                      value={formData.session_type}
                      onValueChange={(value) => setFormData({ ...formData, session_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về session"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Thời gian bắt đầu *</Label>
                    <Input
                      id="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">Thời gian kết thúc *</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm</Label>
                    <Input
                      id="location"
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Phòng / Sân khấu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="track">Track</Label>
                    <Select
                      value={formData.track || "main"}
                      onValueChange={(value) => setFormData({ ...formData, track: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tracks.map((track) => (
                          <SelectItem key={track.value} value={track.value}>
                            {track.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_capacity">Sức chứa tối đa</Label>
                    <Input
                      id="max_capacity"
                      type="number"
                      value={formData.max_capacity || ""}
                      onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Số người"
                    />
                  </div>
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
          Thêm Session
        </Button>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mb-4 opacity-50" />
              <p>Chưa có session nào</p>
              <p className="text-sm">Nhấn "Thêm Session" để tạo mới</p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <motion.div
              key={session.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{session.title}</h3>
                        <Badge variant="outline">
                          {sessionTypes.find((t) => t.value === session.session_type)?.label || session.session_type}
                        </Badge>
                        {session.track && (
                          <Badge variant="secondary">
                            {tracks.find((t) => t.value === session.track)?.label || session.track}
                          </Badge>
                        )}
                      </div>
                      {session.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(session.start_time), "dd/MM HH:mm", { locale: vi })} - {format(new Date(session.end_time), "HH:mm", { locale: vi })}
                        </span>
                        {session.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {session.location}
                          </span>
                        )}
                        {session.max_capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {session.max_capacity} người
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(session)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(session.id)}>
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
