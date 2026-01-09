import { useTheme, SeasonTheme, FestiveTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Palette, Sparkles } from "lucide-react";

const seasons: { value: SeasonTheme; label: string; icon: string }[] = [
  { value: 'spring', label: 'Mùa Xuân', icon: '🌸' },
  { value: 'summer', label: 'Mùa Hạ', icon: '☀️' },
  { value: 'autumn', label: 'Mùa Thu', icon: '🍂' },
  { value: 'winter', label: 'Mùa Đông', icon: '❄️' },
];

const festives: { value: FestiveTheme; label: string; icon: string }[] = [
  { value: null, label: 'Không có', icon: '✨' },
  { value: 'christmas', label: 'Giáng sinh', icon: '🎄' },
  { value: 'lunar-new-year', label: 'Tết Nguyên Đán', icon: '🧧' },
  { value: 'vietnam-national', label: 'Quốc Khánh', icon: '🇻🇳' },
  { value: 'halloween', label: 'Halloween', icon: '🎃' },
  { value: 'valentine', label: 'Valentine', icon: '💕' },
  { value: 'new-year', label: 'Năm Mới', icon: '🎉' },
];

export function ThemeSwitcher() {
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

  const currentSeason = seasons.find(s => s.value === season);
  const currentFestive = festives.find(f => f.value === festive);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          {festive && (
            <span className="absolute -top-1 -right-1 text-xs">
              {currentFestive?.icon}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Chủ đề
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuCheckboxItem
          checked={autoSeason}
          onCheckedChange={setAutoSeason}
        >
          Tự động theo mùa
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={effectsEnabled}
          onCheckedChange={setEffectsEnabled}
        >
          Hiệu ứng động
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Mùa</DropdownMenuLabel>
        
        {seasons.map((s) => (
          <DropdownMenuItem
            key={s.value}
            onClick={() => {
              setSeason(s.value);
              setAutoSeason(false);
            }}
            className={season === s.value ? 'bg-accent' : ''}
          >
            <span className="mr-2">{s.icon}</span>
            {s.label}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Lễ hội</DropdownMenuLabel>
        
        {festives.map((f) => (
          <DropdownMenuItem
            key={f.value || 'none'}
            onClick={() => setFestive(f.value)}
            className={festive === f.value ? 'bg-accent' : ''}
          >
            <span className="mr-2">{f.icon}</span>
            {f.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
