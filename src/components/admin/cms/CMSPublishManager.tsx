import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  FileEdit, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  History,
  Loader2,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PublishStatus {
  id: string;
  name: string;
  table: string;
  is_published: boolean;
  has_draft: boolean;
  updated_at: string;
  published_at: string | null;
}

interface PublishHistoryItem {
  id: string;
  content_type: string;
  action: string;
  created_at: string;
  changes: any;
}

type CMSTableName = "cms_hero" | "cms_features" | "cms_cta" | "cms_footer" | "cms_settings";

const contentTypes: { name: string; table: CMSTableName; key: string }[] = [
  { name: "Hero Banner", table: "cms_hero", key: "hero" },
  { name: "Tính năng", table: "cms_features", key: "features" },
  { name: "Call to Action", table: "cms_cta", key: "cta" },
  { name: "Footer", table: "cms_footer", key: "footer" },
  { name: "Cài đặt", table: "cms_settings", key: "settings" },
];

export function CMSPublishManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

  // Fetch all content statuses
  const { data: statuses, isLoading: statusLoading, refetch } = useQuery({
    queryKey: ["cms-publish-status"],
    queryFn: async () => {
      const results: PublishStatus[] = [];
      
      for (const ct of contentTypes) {
        // Use raw query to avoid type issues with new columns
        const { data, error } = await supabase
          .from(ct.table)
          .select("*")
          .limit(1)
          .maybeSingle();
        
        if (data && !error) {
          const row = data as any;
          results.push({
            id: row.id,
            name: ct.name,
            table: ct.table,
            is_published: row.is_published ?? true,
            has_draft: row.has_draft ?? false,
            updated_at: row.updated_at,
            published_at: row.published_at ?? null,
          });
        }
      }
      
      return results;
    },
  });

  // Fetch publish history
  const { data: history } = useQuery({
    queryKey: ["cms-publish-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_publish_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as PublishHistoryItem[];
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      // Update the content to published
      const { error: updateError } = await supabase
        .from(table as any)
        .update({ 
          is_published: true, 
          has_draft: false,
          published_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (updateError) throw updateError;

      // Log the publish action
      const { error: logError } = await supabase
        .from("cms_publish_history")
        .insert({
          content_type: table,
          content_id: id,
          action: "publish",
          published_by: user?.id,
        });

      if (logError) console.error("Failed to log publish:", logError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-publish-status"] });
      queryClient.invalidateQueries({ queryKey: ["cms-publish-history"] });
      toast({ title: "Đã xuất bản!", description: "Nội dung đã được công khai." });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  // Unpublish mutation
  const unpublishMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error: updateError } = await supabase
        .from(table as any)
        .update({ is_published: false })
        .eq("id", id);
      
      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from("cms_publish_history")
        .insert({
          content_type: table,
          content_id: id,
          action: "unpublish",
          published_by: user?.id,
        });

      if (logError) console.error("Failed to log unpublish:", logError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-publish-status"] });
      queryClient.invalidateQueries({ queryKey: ["cms-publish-history"] });
      toast({ title: "Đã ẩn!", description: "Nội dung đã được ẩn khỏi trang công khai." });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  // Publish all mutation
  const publishAllMutation = useMutation({
    mutationFn: async () => {
      for (const status of statuses || []) {
        if (!status.is_published || status.has_draft) {
          await publishMutation.mutateAsync({ table: status.table, id: status.id });
        }
      }
    },
    onSuccess: () => {
      toast({ title: "Đã xuất bản tất cả!", description: "Tất cả nội dung đã được công khai." });
    },
  });

  const getStatusBadge = (status: PublishStatus) => {
    if (status.has_draft) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
          <FileEdit className="w-3 h-3 mr-1" />
          Có bản nháp
        </Badge>
      );
    }
    if (status.is_published) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Đã xuất bản
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <AlertCircle className="w-3 h-3 mr-1" />
        Chưa xuất bản
      </Badge>
    );
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "publish": return "Xuất bản";
      case "unpublish": return "Ẩn";
      case "save_draft": return "Lưu nháp";
      default: return action;
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const hasUnpublished = statuses?.some(s => !s.is_published || s.has_draft);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Quản lý trạng thái xuất bản của các nội dung CMS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          {hasUnpublished && (
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => publishAllMutation.mutate()}
              disabled={publishAllMutation.isPending}
            >
              {publishAllMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Xuất bản tất cả
            </Button>
          )}
        </div>
      </div>

      {/* Content Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statuses?.map((status) => (
          <Card key={status.table} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{status.name}</CardTitle>
                {getStatusBadge(status)}
              </div>
              {status.published_at && (
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  Xuất bản: {format(new Date(status.published_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {status.is_published ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => unpublishMutation.mutate({ table: status.table, id: status.id })}
                    disabled={unpublishMutation.isPending}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Ẩn
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => publishMutation.mutate({ table: status.table, id: status.id })}
                    disabled={publishMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Xuất bản
                  </Button>
                )}
                {status.has_draft && (
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => publishMutation.mutate({ table: status.table, id: status.id })}
                    disabled={publishMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Xuất bản nháp
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publish History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Lịch sử xuất bản
          </CardTitle>
          <CardDescription>
            Theo dõi các thay đổi xuất bản gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history && history.length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.action === "publish" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : item.action === "unpublish" ? (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <FileEdit className="w-4 h-4 text-blue-500" />
                      )}
                      <div>
                        <span className="font-medium text-sm">
                          {getActionLabel(item.action)}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          {item.content_type.replace("cms_", "").replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có lịch sử xuất bản</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
