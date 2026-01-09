import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CMSPreviewPanelProps {
  previewPath?: string;
}

const deviceSizes = {
  desktop: { width: "100%", height: "100%", label: "Desktop" },
  tablet: { width: "768px", height: "1024px", label: "Tablet" },
  mobile: { width: "375px", height: "667px", label: "Mobile" },
};

export function CMSPreviewPanel({ previewPath = "/" }: CMSPreviewPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [device, setDevice] = useState<keyof typeof deviceSizes>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(previewPath, "_blank");
  };

  const currentDevice = deviceSizes[device];

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        {isVisible ? (
          <>
            <EyeOff className="w-4 h-4 mr-2" />
            Ẩn Preview
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Xem Preview
          </>
        )}
      </Button>

      {/* Preview Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed z-40 bg-background border-l border-border shadow-2xl ${
              isFullscreen 
                ? "inset-0" 
                : "top-0 right-0 bottom-0 w-[50vw]"
            }`}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Preview</span>
                <Select value={device} onValueChange={(v) => setDevice(v as keyof typeof deviceSizes)}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Desktop
                      </div>
                    </SelectItem>
                    <SelectItem value="tablet">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-4 h-4" />
                        Tablet
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleRefresh} title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleOpenInNewTab} title="Open in new tab">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} title="Close">
                  <EyeOff className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 h-[calc(100%-52px)] overflow-auto bg-muted/50 p-4 flex justify-center">
              <div
                className="bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  width: currentDevice.width,
                  height: device === "desktop" ? "100%" : currentDevice.height,
                  maxWidth: "100%",
                }}
              >
                <iframe
                  key={refreshKey}
                  src={previewPath}
                  className="w-full h-full border-0"
                  title="Preview"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
