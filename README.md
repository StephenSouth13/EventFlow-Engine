🚀 EventScale OS | Multi-Tenant Landing Page Automation
EventScale OS là nền tảng quản lý và tự động hóa Landing Page dành riêng cho hệ sinh thái Learn For Growth. Hệ thống cho phép khởi tạo, tùy chỉnh giao diện và điều hướng hàng trăm Subdomain chỉ từ một bộ mã nguồn duy nhất.

🌟 Tính năng "Siêu đỉnh"
Multi-tenant Routing: Tự động nhận diện và đổ dữ liệu theo Subdomain (ví dụ: festival.learnforgrowth.com.vn).

Dynamic CMS: Chỉnh sửa Hero, Stats, CTA, Diễn giả... thời gian thực qua Admin Dashboard.

Theme Engine: 10+ bộ Theme mẫu (Ocean Blue, Sunset Gold, Tech Dark...) tích hợp sẵn.

Role-Based Access (RBAC): Phân quyền chặt chẽ (Admin, Startup, Investor, Speaker).

Draft & Publish: Hệ thống lưu nháp và xuất bản nội dung chuyên nghiệp.

🛠️ Công nghệ sử dụng
Frontend: React + Vite + TypeScript.

UI Lib: shadcn/ui + Tailwind CSS + Lucide Icons.

Backend: Supabase (Database, Auth, Storage, Real-time).

Deployment: Vercel (Hỗ trợ Wildcard Subdomains).

🏗️ Cấu trúc Database (Supabase)
Hệ thống vận hành dựa trên các bảng chính:

templates & template_domains: Lõi điều hướng Multi-tenant.

cms_hero, cms_stats, cms_features: Quản lý nội dung Landing Page.

homepage_themes: Lưu trữ cấu hình màu sắc và font chữ.

user_roles: Quản lý quyền Admin.

💻 Hướng dẫn phát triển (Local Development)
1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt Node.js và pnpm.

Bash

# Clone repository
git clone <YOUR_GIT_URL>

# Cài đặt dependencies
pnpm install

# Khởi chạy dev server
pnpm dev
2. Biến môi trường (.env)
Tạo file .env tại thư mục gốc và cấu hình kết nối Supabase:

Đoạn mã

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Kích hoạt quyền Admin
Để vào được /admin/cms, bạn cần gán quyền admin cho user trong SQL Editor của Supabase:

SQL

INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'admin');
🌐 Hướng dẫn Triển khai (Deployment)
1. Deploy lên Vercel
Kết nối Repo với Vercel.

Thêm các biến môi trường VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.

Nhấn Deploy.

2. Cấu hình Domain & Subdomains
Tại Vercel: Settings > Domains > Add *.learnforgrowth.com.vn.

Tại Supabase: Thêm bản ghi vào bảng template_domains để map subdomain với template tương ứng.

🛠️ Chỉnh sửa bằng Lovable
Bạn có thể tiếp tục dùng AI để phát triển tính năng mới:

Truy cập Lovable Project.

Prompting các yêu cầu mới (ví dụ: "Thêm block Countdown cho Hero section").

Thay đổi sẽ tự động được commit về Github này.

📝 Giấy phép & Liên hệ
Dự án thuộc sở hữu của Learn For Growth (LFG).

Website: learnforgrowth.com.vn

Admin CMS: /admin/cms