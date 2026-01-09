import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TemplateData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_default: boolean;
  is_public: boolean;
}

export interface TemplateConfig {
  id: string;
  template_id: string;
  event_title?: string;
  event_date?: string;
  event_location?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_family?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  sections_enabled?: string;
  custom_css?: string;
}

export interface DomainMapping {
  id: string;
  template_id: string;
  domain: string;
  subdomain?: string;
  is_active: boolean;
  ssl_enabled: boolean;
  templates?: TemplateData;
  template_configs?: TemplateConfig[];
}

/**
 * Get current domain from window.location.host
 * Handles subdomains and root domains
 */
export const getCurrentDomain = (): string => {
  if (typeof window === "undefined") return "";
  return window.location.host.toLowerCase();
};

/**
 * Hook to load template data based on current domain
 */
export function useCurrentTemplate() {
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    setDomain(getCurrentDomain());
  }, []);

  const {
    data: domainMapping,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["domain-mapping", domain],
    queryFn: async () => {
      if (!domain) return null;

      // Try exact domain match first
      const { data, error } = await supabase
        .from("template_domains")
        .select("*, templates(*), template_configs(*)")
        .eq("domain", domain)
        .eq("is_active", true)
        .single();

      if (error && error.code === "PGRST116") {
        // No exact match, try to get default template
        const { data: defaultData, error: defaultError } = await supabase
          .from("templates")
          .select("*")
          .eq("is_default", true)
          .eq("deleted_at", null)
          .single();

        if (defaultError) throw defaultError;

        // Get config for default template
        const { data: configData } = await supabase
          .from("template_configs")
          .select("*")
          .eq("template_id", defaultData.id)
          .single();

        return {
          template_id: defaultData.id,
          templates: defaultData,
          template_configs: configData ? [configData] : [],
        };
      }

      if (error) throw error;
      return data;
    },
    enabled: !!domain,
  });

  const template = domainMapping?.templates;
  const config = domainMapping?.template_configs?.[0];

  // Parse sections if they're JSON strings
  const enabledSections = config?.sections_enabled
    ? JSON.parse(config.sections_enabled)
    : [];

  // Parse custom CSS
  const customCSS = config?.custom_css || "";

  return {
    domain,
    template,
    config,
    domainMapping,
    enabledSections,
    customCSS,
    isLoading,
    error,
  };
}

/**
 * Hook to load a specific template by ID or slug
 */
export function useTemplate(templateIdOrSlug: string) {
  const { data: template, isLoading, error } = useQuery({
    queryKey: ["template", templateIdOrSlug],
    queryFn: async () => {
      // Try to find by slug first
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .or(`id.eq.${templateIdOrSlug},slug.eq.${templateIdOrSlug}`)
        .is("deleted_at", null)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!templateIdOrSlug,
  });

  const { data: config } = useQuery({
    queryKey: ["template-config", template?.id],
    queryFn: async () => {
      if (!template?.id) return null;

      const { data, error } = await supabase
        .from("template_configs")
        .select("*")
        .eq("template_id", template.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!template?.id,
  });

  const enabledSections = config?.sections_enabled
    ? JSON.parse(config.sections_enabled)
    : [];

  return {
    template,
    config,
    enabledSections,
    isLoading,
    error,
  };
}

/**
 * Hook to load all domains for a specific template
 */
export function useTemplateDomains(templateId: string) {
  const { data: domains, isLoading, error } = useQuery({
    queryKey: ["template-domains", templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_domains")
        .select("*, templates(*)")
        .eq("template_id", templateId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!templateId,
  });

  return {
    domains: domains || [],
    isLoading,
    error,
  };
}

/**
 * Hook to apply template styling (colors, fonts, CSS)
 * Automatically injects styles into document head
 */
export function useApplyTemplateStyles(
  primaryColor?: string,
  secondaryColor?: string,
  accentColor?: string,
  fontFamily?: string,
  customCSS?: string
) {
  useEffect(() => {
    // Remove existing template style if it exists
    const existingStyle = document.getElementById("template-dynamic-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    if (!primaryColor && !fontFamily && !customCSS) {
      return;
    }

    const style = document.createElement("style");
    style.id = "template-dynamic-styles";

    let css = ":root {\n";

    if (primaryColor) {
      // Convert hex to HSL for better theme support
      css += `  --primary: ${primaryColor};\n`;
    }
    if (secondaryColor) {
      css += `  --secondary: ${secondaryColor};\n`;
    }
    if (accentColor) {
      css += `  --accent: ${accentColor};\n`;
    }
    if (fontFamily) {
      css += `  --font-sans: ${fontFamily};\n`;
    }

    css += "}\n\n";

    if (customCSS) {
      css += customCSS;
    }

    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [primaryColor, secondaryColor, accentColor, fontFamily, customCSS]);
}
