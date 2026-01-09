import { useState, useEffect } from "react";
import { 
  useCMSFeatures, 
  useCMSFeatureItems, 
  useUpdateCMSFeatures, 
  useUpdateCMSFeatureItem,
  useCreateCMSFeatureItem,
  useDeleteCMSFeatureItem 
} from "@/hooks/useCMS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconOptions = [
  "Rocket", "Handshake", "Mic2", "Users", "Lightbulb", "Trophy",
  "Star", "Target", "Zap", "Globe", "Heart", "Shield", "Award", "Compass"
];

export function CMSFeaturesEditor() {
  const { data: features, isLoading: featuresLoading } = useCMSFeatures();
  const { data: items, isLoading: itemsLoading } = useCMSFeatureItems();
  const updateFeatures = useUpdateCMSFeatures();
  const updateItem = useUpdateCMSFeatureItem();
  const createItem = useCreateCMSFeatureItem();
  const deleteItem = useDeleteCMSFeatureItem();
  const { toast } = useToast();

  const [sectionForm, setSectionForm] = useState({
    section_title: "",
    section_subtitle: "",
  });

  const [newItem, setNewItem] = useState({
    icon_name: "Rocket",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (features) {
      setSectionForm({
        section_title: features.section_title || "",
        section_subtitle: features.section_subtitle || "",
      });
    }
  }, [features]);

  const handleSaveSection = async () => {
    if (!features?.id) return;
    try {
      await updateFeatures.mutateAsync({ id: features.id, ...sectionForm });
      toast({ title: "Saved!", description: "Section header updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateItem = async (id: string, field: string, value: any) => {
    try {
      await updateItem.mutateAsync({ id, [field]: value });
      toast({ title: "Updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateItem = async () => {
    if (!newItem.title || !newItem.description) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    try {
      await createItem.mutateAsync({
        ...newItem,
        sort_order: (items?.length || 0) + 1,
        is_active: true,
      });
      setNewItem({ icon_name: "Rocket", title: "", description: "" });
      toast({ title: "Created!", description: "New feature added." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this feature?")) return;
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Deleted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (featuresLoading || itemsLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold">Section Header</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={sectionForm.section_title}
              onChange={(e) => setSectionForm({ ...sectionForm, section_title: e.target.value })}
              placeholder="What to Expect"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={sectionForm.section_subtitle}
              onChange={(e) => setSectionForm({ ...sectionForm, section_subtitle: e.target.value })}
              placeholder="Three days packed with..."
            />
          </div>
        </div>
        <Button onClick={handleSaveSection} disabled={updateFeatures.isPending} size="sm">
          {updateFeatures.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Header
        </Button>
      </div>

      {/* Feature Items */}
      <div className="space-y-4">
        <h3 className="font-semibold">Feature Cards</h3>
        
        {items?.map((item) => (
          <div key={item.id} className="p-4 bg-muted/30 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select
                  value={item.icon_name}
                  onValueChange={(v) => handleUpdateItem(item.id, "icon_name", v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={(checked) => handleUpdateItem(item.id, "is_active", checked)}
                  />
                  <Label className="text-sm text-muted-foreground">Active</Label>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteItem(item.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Input
              defaultValue={item.title}
              onBlur={(e) => handleUpdateItem(item.id, "title", e.target.value)}
              placeholder="Feature title"
            />

            <Textarea
              defaultValue={item.description}
              onBlur={(e) => handleUpdateItem(item.id, "description", e.target.value)}
              placeholder="Feature description"
              rows={2}
            />
          </div>
        ))}

        {/* Add New */}
        <div className="p-4 border-2 border-dashed border-border rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Add New Feature</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Select
              value={newItem.icon_name}
              onValueChange={(v) => setNewItem({ ...newItem, icon_name: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Title"
            />

            <Input
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Description"
            />
          </div>

          <Button onClick={handleCreateItem} disabled={createItem.isPending}>
            {createItem.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Feature
          </Button>
        </div>
      </div>
    </div>
  );
}
