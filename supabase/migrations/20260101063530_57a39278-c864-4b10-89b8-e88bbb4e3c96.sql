--D:\Website\EventFlow-Engine\supabase\migrations\20260101063530_57a39278-c864-4b10-89b8-e88bbb4e3c96.sql--
-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;