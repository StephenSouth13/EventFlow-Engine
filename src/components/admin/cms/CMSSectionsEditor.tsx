import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Section {
  id: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  sort_order: number;
}

export function CMSSectionsEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ["cms-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_sections")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Section[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("cms_sections")
        .update({ is_visible })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-sections"] });
      toast({ title: "Đã cập nhật!" });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Bật/tắt hiển thị các section trên trang chủ. Các section bị ẩn sẽ không hiển thị cho người dùng.
      </p>
      
      <div className="grid gap-3">
        {sections?.map((section) => (
          <Card 
            key={section.id} 
            className={`p-4 transition-all ${section.is_visible ? 'bg-card' : 'bg-muted/30 opacity-60'}`}
          >
            <div className="flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {section.is_visible ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{section.section_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Key: {section.section_key}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-sm text-muted-foreground">
                  {section.is_visible ? "Đang hiện" : "Đang ẩn"}
                </Label>
                <Switch
                  checked={section.is_visible}
                  onCheckedChange={(checked) => 
                    updateMutation.mutate({ id: section.id, is_visible: checked })
                  }
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
