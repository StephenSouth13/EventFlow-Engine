import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
}

interface Section {
  id: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  sort_order: number;
}

export function useCMSNavigation() {
  return useQuery({
    queryKey: ["cms-navigation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_navigation")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (error) throw error;
      return data as NavItem[];
    },
  });
}

export function useCMSSections() {
  return useQuery({
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
}

export function useSectionVisibility(sectionKey: string) {
  const { data: sections } = useCMSSections();
  const section = sections?.find((s) => s.section_key === sectionKey);
  return section?.is_visible ?? true;
}
