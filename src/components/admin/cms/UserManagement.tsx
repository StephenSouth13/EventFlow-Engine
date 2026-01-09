import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit2, Shield, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  user_roles?: Array<{
    id: string;
    role: string;
    created_at: string;
  }>;
}

const AVAILABLE_ROLES = ["attendee", "startup", "investor", "speaker", "sponsor", "admin"];

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // 1. Lấy danh sách profiles thay vì auth.admin (để chạy được trên Vercel)
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, created_at");

      if (profileError) throw profileError;

      // 2. Lấy toàn bộ roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // 3. Map dữ liệu lồng nhau
      const usersWithRoles: UserWithRole[] = (profiles || []).map((user) => ({
        id: user.id,
        email: user.email || "No Email",
        created_at: user.created_at,
        user_roles: rolesData?.filter((role) => role.user_id === user.id) || [],
      }));

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Load users error:", error);
      toast({ title: "Lỗi kết nối", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async (userId: string) => {
    if (!selectedRole) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: selectedRole }]);

      if (error) throw error;

      toast({ title: "Thành công", description: `Đã thêm quyền ${selectedRole}` });
      setSelectedRole("");
      setEditingUserId(null);
      loadUsers();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
      toast({ title: "Đã xóa", description: "Quyền đã được thu hồi" });
      loadUsers();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((user) => {
    const emailMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());
    const roleMatch = !filterRole || user.user_roles?.some((r) => r.role === filterRole);
    return emailMatch && roleMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm email..."
              className="pl-8"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Lọc quyền" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-roles">Tất cả quyền</SelectItem>
              {AVAILABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{user.email}</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      ID: {user.id.slice(0, 8)}...
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tham gia từ: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.user_roles?.map((role) => (
                      <div key={role.id} className="inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        {role.role}
                        <button 
                          onClick={() => handleRemoveRole(role.id)}
                          className="ml-2 hover:text-destructive transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingUserId === user.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue placeholder="Chọn quyền" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => handleAddRole(user.id)} disabled={submitting}>
                        Lưu
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingUserId(null)}>
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingUserId(user.id)}>
                      <Edit2 className="w-3.5 h-3.5 mr-2" />
                      Gán quyền
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}