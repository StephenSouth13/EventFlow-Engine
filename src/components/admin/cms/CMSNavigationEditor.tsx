import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, GripVertical, Save } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
}

export function CMSNavigationEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState({ label: "", href: "" });

  const { data: navItems, isLoading } = useQuery({
    queryKey: ["cms-navigation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_navigation")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as NavItem[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NavItem> & { id: string }) => {
      const { error } = await supabase
        .from("cms_navigation")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-navigation"] });
      toast({ title: "Đã cập nhật!" });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: { label: string; href: string }) => {
      const { error } = await supabase
        .from("cms_navigation")
        .insert({
          label: item.label,
          href: item.href,
          sort_order: (navItems?.length || 0) + 1,
          is_visible: true,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-navigation"] });
      setNewItem({ label: "", href: "" });
      toast({ title: "Đã thêm menu mới!" });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_navigation").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-navigation"] });
      toast({ title: "Đã xóa!" });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  const handleCreate = () => {
    if (!newItem.label || !newItem.href) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }
    createMutation.mutate(newItem);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {navItems?.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
            
            <Input
              defaultValue={item.label}
              onBlur={(e) => updateMutation.mutate({ id: item.id, label: e.target.value })}
              placeholder="Tên menu"
              className="w-40"
            />
            
            <Input
              defaultValue={item.href}
              onBlur={(e) => updateMutation.mutate({ id: item.id, href: e.target.value })}
              placeholder="Đường dẫn"
              className="flex-1"
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={item.is_visible}
                onCheckedChange={(checked) => updateMutation.mutate({ id: item.id, is_visible: checked })}
              />
              <Label className="text-sm text-muted-foreground">Hiện</Label>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Bạn có chắc muốn xóa menu này?")) {
                  deleteMutation.mutate(item.id);
                }
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Item */}
      <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-lg">
        <Plus className="w-5 h-5 text-muted-foreground" />
        
        <Input
          value={newItem.label}
          onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
          placeholder="Tên menu mới"
          className="w-40"
        />
        
        <Input
          value={newItem.href}
          onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
          placeholder="Đường dẫn (vd: /about)"
          className="flex-1"
        />
        
        <Button onClick={handleCreate} disabled={createMutation.isPending}>
          {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Thêm"}
        </Button>
      </div>
    </div>
  );
}
