import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Eye, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw,
  ExternalLink 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CMSPreviewModalProps {
  path?: string;
  title?: string;
  trigger?: React.ReactNode;
}

const deviceSizes = {
  desktop: { width: "100%", height: "80vh" },
  tablet: { width: "768px", height: "70vh" },
  mobile: { width: "375px", height: "70vh" },
};

export function CMSPreviewModal({ 
  path = "/", 
  title = "Preview",
  trigger 
}: CMSPreviewModalProps) {
  const [device, setDevice] = useState<keyof typeof deviceSizes>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(path, "_blank");
  };

  const currentDevice = deviceSizes[device];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center gap-4">
              {/* Device Selector */}
              <Tabs value={device} onValueChange={(v) => setDevice(v as keyof typeof deviceSizes)}>
                <TabsList>
                  <TabsTrigger value="desktop" className="gap-2">
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">Desktop</span>
                  </TabsTrigger>
                  <TabsTrigger value="tablet" className="gap-2">
                    <Tablet className="w-4 h-4" />
                    <span className="hidden sm:inline">Tablet</span>
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleOpenInNewTab}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Frame */}
        <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4 flex justify-center items-start">
          <motion.div
            layout
            className="bg-background rounded-lg shadow-xl overflow-hidden border border-border"
            style={{
              width: currentDevice.width,
              height: currentDevice.height,
              maxWidth: "100%",
            }}
          >
            <iframe
              key={refreshKey}
              src={path}
              className="w-full h-full border-0"
              title="Preview"
            />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
