import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Video, FileText, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CMSMediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  bucket?: string;
  folder?: string;
}

export function CMSMediaUploader({
  value,
  onChange,
  accept = "image/*",
  label = "Tải lên",
  bucket = "cms-images",
  folder = "uploads",
}: CMSMediaUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = () => {
    if (accept.includes("image")) return <Image className="w-8 h-8" />;
    if (accept.includes("video")) return <Video className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Lỗi", description: "File quá lớn. Tối đa 50MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setProgress(100);
      onChange(urlData.publicUrl);
      toast({ title: "Thành công!", description: "Đã tải lên file." });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative rounded-lg border border-border overflow-hidden bg-muted/30">
          {isImage(value) ? (
            <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          ) : isVideo(value) ? (
            <video src={value} controls className="w-full h-48 object-cover" />
          ) : (
            <div className="flex items-center justify-center h-48">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="p-2 text-xs text-muted-foreground truncate bg-background/80">
            {value}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-colors"
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <Progress value={progress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground">Đang tải lên... {progress}%</p>
            </div>
          ) : (
            <>
              <div className="text-muted-foreground mb-2">
                {getFileIcon()}
              </div>
              <p className="text-sm text-muted-foreground">
                Click để chọn file hoặc kéo thả vào đây
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tối đa 50MB
              </p>
            </>
          )}
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {/* URL Input option */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">hoặc nhập URL:</span>
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 text-xs"
        />
      </div>
    </div>
  );
}
