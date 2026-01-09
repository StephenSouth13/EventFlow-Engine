import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme, SeasonTheme, FestiveTheme } from "@/contexts/ThemeContext";
import { Palette, Sparkles, Calendar, PartyPopper } from "lucide-react";

const seasons: { value: SeasonTheme; label: string; icon: string; description: string }[] = [
  { value: 'spring', label: 'Mùa Xuân', icon: '🌸', description: 'Tông màu tươi sáng, hoa anh đào' },
  { value: 'summer', label: 'Mùa Hạ', icon: '☀️', description: 'Năng động, xanh biển và vàng' },
  { value: 'autumn', label: 'Mùa Thu', icon: '🍂', description: 'Trầm ấm, cam đất và nâu' },
  { value: 'winter', label: 'Mùa Đông', icon: '❄️', description: 'Lạnh, xanh băng và trắng' },
];

const festives: { value: FestiveTheme; label: string; icon: string; description: string }[] = [
  { value: null, label: 'Không có', icon: '✨', description: 'Sử dụng theme mùa' },
  { value: 'christmas', label: 'Giáng sinh', icon: '🎄', description: 'Đỏ, xanh lá, tuyết rơi' },
  { value: 'lunar-new-year', label: 'Tết Nguyên Đán', icon: '🧧', description: 'Đỏ, vàng, lì xì bay' },
  { value: 'vietnam-national', label: 'Quốc Khánh 2/9', icon: '🇻🇳', description: 'Cờ đỏ sao vàng' },
  { value: 'halloween', label: 'Halloween', icon: '🎃', description: 'Cam, tím, ma và bí ngô' },
  { value: 'valentine', label: 'Valentine', icon: '💕', description: 'Hồng, trái tim bay' },
  { value: 'new-year', label: 'Năm Mới', icon: '🎉', description: 'Confetti, countdown' },
];

export function CMSThemeEditor() {
  const {
    season,
    festive,
    autoSeason,
    setSeason,
    setFestive,
    setAutoSeason,
    effectsEnabled,
    setEffectsEnabled,
  } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Palette className="w-6 h-6" />
          Quản lý Theme
        </h2>
        <p className="text-muted-foreground">
          Tùy chỉnh giao diện theo mùa và lễ hội
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Cài đặt chung
            </CardTitle>
            <CardDescription>
              Điều chỉnh hành vi của hệ thống theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-season">Tự động theo mùa</Label>
                <p className="text-sm text-muted-foreground">
                  Tự động đổi theme dựa vào tháng
                </p>
              </div>
              <Switch
                id="auto-season"
                checked={autoSeason}
                onCheckedChange={setAutoSeason}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="effects">Hiệu ứng động</Label>
                <p className="text-sm text-muted-foreground">
                  Tuyết rơi, lá bay, confetti...
                </p>
              </div>
              <Switch
                id="effects"
                checked={effectsEnabled}
                onCheckedChange={setEffectsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Season Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Theme theo mùa
            </CardTitle>
            <CardDescription>
              Chọn giao diện phù hợp với mùa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={season}
              onValueChange={(value) => {
                setSeason(value as SeasonTheme);
                setAutoSeason(false);
              }}
              disabled={autoSeason}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {autoSeason && (
              <p className="mt-2 text-sm text-muted-foreground">
                Đang ở chế độ tự động. Tắt để chọn thủ công.
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              {seasons.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setSeason(s.value);
                    setAutoSeason(false);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    season === s.value && !autoSeason
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <p className="font-medium mt-1">{s.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Festive Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5" />
            Theme lễ hội
          </CardTitle>
          <CardDescription>
            Bật theme đặc biệt cho các dịp lễ hội. Theme lễ hội sẽ ghi đè theme mùa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {festives.map((f) => (
              <button
                key={f.value || 'none'}
                onClick={() => setFestive(f.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  festive === f.value
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-3xl">{f.icon}</span>
                <p className="font-medium mt-2">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Xem trước</CardTitle>
          <CardDescription>
            Theme hiện tại: {seasons.find(s => s.value === season)?.icon} {seasons.find(s => s.value === season)?.label}
            {festive && ` + ${festives.find(f => f.value === festive)?.icon} ${festives.find(f => f.value === festive)?.label}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-lg gradient-hero border border-border">
            <h3 className="text-xl font-bold mb-2">
              SISF <span className="gradient-text">2026</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              Đây là preview của theme hiện tại
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground font-medium shadow-glow">
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50">
                Secondary
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
