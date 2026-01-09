import { useState } from "react";
import { useCMSStats, useUpdateCMSStat, useCreateCMSStat, useDeleteCMSStat } from "@/hooks/useCMS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CMSStatsEditor() {
  const { data: stats, isLoading } = useCMSStats();
  const updateStat = useUpdateCMSStat();
  const createStat = useCreateCMSStat();
  const deleteStat = useDeleteCMSStat();
  const { toast } = useToast();
  const [newStat, setNewStat] = useState({ value: "", label: "" });

  const handleUpdate = async (id: string, field: string, value: any) => {
    try {
      await updateStat.mutateAsync({ id, [field]: value });
      toast({ title: "Updated!", description: "Stat updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreate = async () => {
    if (!newStat.value || !newStat.label) {
      toast({ title: "Error", description: "Please fill in both fields.", variant: "destructive" });
      return;
    }

    try {
      await createStat.mutateAsync({
        value: newStat.value,
        label: newStat.label,
        sort_order: (stats?.length || 0) + 1,
        is_active: true,
      });
      setNewStat({ value: "", label: "" });
      toast({ title: "Created!", description: "New stat added successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) return;

    try {
      await deleteStat.mutateAsync(id);
      toast({ title: "Deleted!", description: "Stat removed successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Existing Stats */}
      <div className="space-y-4">
        {stats?.map((stat) => (
          <div key={stat.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
            
            <Input
              defaultValue={stat.value}
              onBlur={(e) => handleUpdate(stat.id, "value", e.target.value)}
              placeholder="Value"
              className="w-32"
            />
            
            <Input
              defaultValue={stat.label}
              onBlur={(e) => handleUpdate(stat.id, "label", e.target.value)}
              placeholder="Label"
              className="flex-1"
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={stat.is_active}
                onCheckedChange={(checked) => handleUpdate(stat.id, "is_active", checked)}
              />
              <Label className="text-sm text-muted-foreground">Active</Label>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(stat.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Stat */}
      <div className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-lg">
        <Plus className="w-5 h-5 text-muted-foreground" />
        
        <Input
          value={newStat.value}
          onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
          placeholder="Value (e.g., 5,000+)"
          className="w-32"
        />
        
        <Input
          value={newStat.label}
          onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
          placeholder="Label (e.g., Attendees)"
          className="flex-1"
        />
        
        <Button onClick={handleCreate} disabled={createStat.isPending}>
          {createStat.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </Button>
      </div>
    </div>
  );
}
