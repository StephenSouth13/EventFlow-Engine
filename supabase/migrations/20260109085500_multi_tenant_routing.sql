-- FILE: 20260109085500_multi_tenant_routing.sql
-- DESCRIPTION: Core tables for Multi-tenant Routing and Domain Management

-- 1. TẠO BẢNG TEMPLATES (Quản lý các mẫu giao diện)
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. TẠO BẢNG TEMPLATE_DOMAINS (Điều hướng Subdomain)
CREATE TABLE IF NOT EXISTS public.template_domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
    domain TEXT UNIQUE NOT NULL, -- Ví dụ: festival.learnforgrowth.com.vn
    subdomain TEXT,               -- Ví dụ: festival
    is_active BOOLEAN DEFAULT TRUE,
    ssl_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TỐI ƯU HÓA: Tạo Index để truy vấn domain siêu nhanh
CREATE INDEX IF NOT EXISTS idx_template_domains_domain ON public.template_domains(domain);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates(slug);

-- 4. BẬT BẢO MẬT RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_domains ENABLE ROW LEVEL SECURITY;

-- 5. THIẾT LẬP QUYỀN TRUY CẬP (Policies)
-- Xóa policy cũ nếu tồn tại để tránh lỗi khi chạy lại
DROP POLICY IF EXISTS "Anyone can view templates" ON public.templates;
DROP POLICY IF EXISTS "Anyone can view template_domains" ON public.template_domains;
DROP POLICY IF EXISTS "Admins can manage templates" ON public.templates;
DROP POLICY IF EXISTS "Admins can manage template_domains" ON public.template_domains;

-- Công khai quyền đọc để trang Landing Page hiển thị được
CREATE POLICY "Anyone can view templates" ON public.templates FOR SELECT USING (true);
CREATE POLICY "Anyone can view template_domains" ON public.template_domains FOR SELECT USING (true);

-- Chỉ ADMIN mới được chỉnh sửa cấu trúc tenant
CREATE POLICY "Admins can manage templates" ON public.templates 
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage template_domains" ON public.template_domains 
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 6. TRIGGER: Tự động cập nhật updated_at
CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON public.templates 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_template_domains_updated_at 
    BEFORE UPDATE ON public.template_domains 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. LÀM MỚI SCHEMA CACHE
NOTIFY pgrst, 'reload schema';