import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface CMSHero {
  id: string;
  badge_text: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  event_date: string;
  event_location: string;
  attendees_text: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  background_image_url: string | null;
}

export interface CMSStat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export interface CMSFeatures {
  id: string;
  section_title: string;
  section_subtitle: string;
}

export interface CMSFeatureItem {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface CMSCTA {
  id: string;
  section_title: string;
  section_subtitle: string;
  final_cta_title: string;
  final_cta_subtitle: string;
  final_cta_button_text: string;
  final_cta_button_link: string;
}

export interface CMSCTACard {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  sort_order: number;
  is_active: boolean;
}

export interface CMSFooter {
  id: string;
  brand_description: string;
  copyright_text: string;
  event_info: string;
  twitter_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
}

export interface CMSSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  meta_title: string;
  meta_description: string;
  og_image_url: string | null;
  event_start_date: string;
  event_end_date: string;
}

// Hooks
export function useCMSHero() {
  return useQuery({
    queryKey: ["cms", "hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_hero")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CMSHero | null;
    },
  });
}

export function useCMSStats() {
  return useQuery({
    queryKey: ["cms", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_stats")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CMSStat[];
    },
  });
}

export function useCMSFeatures() {
  return useQuery({
    queryKey: ["cms", "features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_features")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CMSFeatures | null;
    },
  });
}

export function useCMSFeatureItems() {
  return useQuery({
    queryKey: ["cms", "featureItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_feature_items")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CMSFeatureItem[];
    },
  });
}

export function useCMSCTA() {
  return useQuery({
    queryKey: ["cms", "cta"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_cta")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CMSCTA | null;
    },
  });
}

export function useCMSCTACards() {
  return useQuery({
    queryKey: ["cms", "ctaCards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_cta_cards")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CMSCTACard[];
    },
  });
}

export function useCMSFooter() {
  return useQuery({
    queryKey: ["cms", "footer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_footer")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CMSFooter | null;
    },
  });
}

export function useCMSSettings() {
  return useQuery({
    queryKey: ["cms", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CMSSettings | null;
    },
  });
}

// Mutations for admin
export function useUpdateCMSHero() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSHero> & { id: string }) => {
      const { error } = await supabase
        .from("cms_hero")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero"] });
    },
  });
}

export function useUpdateCMSStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSStat> & { id: string }) => {
      const { error } = await supabase
        .from("cms_stats")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "stats"] });
    },
  });
}

export function useCreateCMSStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CMSStat, "id">) => {
      const { error } = await supabase.from("cms_stats").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "stats"] });
    },
  });
}

export function useDeleteCMSStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_stats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "stats"] });
    },
  });
}

export function useUpdateCMSFeatures() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSFeatures> & { id: string }) => {
      const { error } = await supabase
        .from("cms_features")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "features"] });
    },
  });
}

export function useUpdateCMSFeatureItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSFeatureItem> & { id: string }) => {
      const { error } = await supabase
        .from("cms_feature_items")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "featureItems"] });
    },
  });
}

export function useCreateCMSFeatureItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CMSFeatureItem, "id">) => {
      const { error } = await supabase.from("cms_feature_items").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "featureItems"] });
    },
  });
}

export function useDeleteCMSFeatureItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_feature_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "featureItems"] });
    },
  });
}

export function useUpdateCMSCTA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSCTA> & { id: string }) => {
      const { error } = await supabase
        .from("cms_cta")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "cta"] });
    },
  });
}

export function useUpdateCMSCTACard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSCTACard> & { id: string }) => {
      const { error } = await supabase
        .from("cms_cta_cards")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "ctaCards"] });
    },
  });
}

export function useUpdateCMSFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSFooter> & { id: string }) => {
      const { error } = await supabase
        .from("cms_footer")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "footer"] });
    },
  });
}

export function useUpdateCMSSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CMSSettings> & { id: string }) => {
      const { error } = await supabase
        .from("cms_settings")
        .update(data)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "settings"] });
    },
  });
}

// Image upload
export async function uploadCMSImage(file: File, path: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from("cms-images")
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data } = supabase.storage
    .from("cms-images")
    .getPublicUrl(fileName);
    
  return data.publicUrl;
}
