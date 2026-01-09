import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth";
import { Navigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LayoutDashboard,
  Image,
  BarChart3,
  Sparkles,
  MessageSquare,
  Settings,
  FileText,
  Palette,
  Calendar,
  Mic,
  Rocket,
  Navigation,
  LayoutGrid,
  Copy,
  Globe,
  Link as LinkIcon,
  Users,
  Mail
} from "lucide-react";
import { CMSHeroEditor } from "@/components/admin/cms/CMSHeroEditor";
import { CMSStatsEditor } from "@/components/admin/cms/CMSStatsEditor";
import { CMSFeaturesEditor } from "@/components/admin/cms/CMSFeaturesEditor";
import { CMSCTAEditor } from "@/components/admin/cms/CMSCTAEditor";
import { CMSFooterEditor } from "@/components/admin/cms/CMSFooterEditor";
import { CMSSettingsEditor } from "@/components/admin/cms/CMSSettingsEditor";
import { CMSThemeEditor } from "@/components/admin/cms/CMSThemeEditor";
import { CMSNavigationEditor } from "@/components/admin/cms/CMSNavigationEditor";
import { CMSSectionsEditor } from "@/components/admin/cms/CMSSectionsEditor";
import { SessionsManager } from "@/components/admin/cms/SessionsManager";
import { SpeakersManager } from "@/components/admin/cms/SpeakersManager";
import { StartupsManager } from "@/components/admin/cms/StartupsManager";
import { CMSPreviewPanel } from "@/components/admin/cms/CMSPreviewPanel";
import { CMSPreviewModal } from "@/components/admin/cms/CMSPreviewModal";
import { CMSPublishManager } from "@/components/admin/cms/CMSPublishManager";
import { TemplatesManager } from "@/components/admin/cms/TemplatesManager";
import { DomainManager } from "@/components/admin/cms/DomainManager";
import { TemplateConfigEditor } from "@/components/admin/cms/TemplateConfigEditor";
import { SocialLinksManager } from "@/components/admin/cms/SocialLinksManager";
import { LogoFooterManager } from "@/components/admin/cms/LogoFooterManager";
import { PageContentManager } from "@/components/admin/cms/PageContentManager";
import { HomepageThemeManager } from "@/components/admin/cms/HomepageThemeManager";
import { UserManagement } from "@/components/admin/cms/UserManagement";
import { ContactSubmissionsManager } from "@/components/admin/cms/ContactSubmissionsManager";
import { Button } from "@/components/ui/button";
import { Eye, Send } from "lucide-react";

const sections = [
  { id: "publish", label: "Xuất bản", icon: Send },
  { id: "templates", label: "Templates", icon: Copy },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "template-config", label: "Cấu hình", icon: Settings },
  { id: "branding", label: "Logo & Footer", icon: FileText },
  { id: "social-links", label: "Social Links", icon: LinkIcon },
  { id: "page-content", label: "Trang (8 Pages)", icon: LayoutGrid },
  { id: "theme", label: "Themes (10 Presets)", icon: Palette },
  { id: "navigation", label: "Menu", icon: Navigation },
  { id: "sections", label: "Sections", icon: LayoutGrid },
  { id: "hero", label: "Hero", icon: Image },
  { id: "stats", label: "Thống kê", icon: BarChart3 },
  { id: "features", label: "Tính năng", icon: Sparkles },
  { id: "cta", label: "CTA", icon: MessageSquare },
  { id: "footer", label: "Footer", icon: FileText },
  { id: "sessions", label: "Sessions", icon: Calendar },
  { id: "speakers", label: "Diễn giả", icon: Mic },
  { id: "startups", label: "Startups", icon: Rocket },
  { id: "users", label: "Users", icon: Users },
  { id: "contacts", label: "Liên hệ", icon: Mail },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export default function CMSDashboard() {
  const { user, userRole, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("publish");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (userRole !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              Quản lý nội dung
            </h1>
            <p className="text-muted-foreground">
              Quản lý tất cả nội dung trên Landing Page
            </p>
          </div>
          <CMSPreviewModal 
            path="/" 
            title="Preview Trang chủ"
            trigger={
              <Button variant="hero" size="default">
                <Eye className="w-4 h-4 mr-2" />
                Xem Preview
              </Button>
            }
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-card/50 p-2 rounded-xl">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="publish">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Xuất bản</CardTitle>
                <CardDescription>
                  Xuất bản hoặc ẩn các nội dung CMS, xem lịch sử thay đổi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSPublishManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Templates</CardTitle>
                <CardDescription>
                  Tạo, chỉnh sửa, nhân bản và xóa các template sự kiện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TemplatesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Domains</CardTitle>
                <CardDescription>
                  Cấu hình domain/subdomain cho mỗi template. VD: festival.learnforgrowth.com.vn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DomainManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template-config">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Cấu hình Template</CardTitle>
                <CardDescription>
                  Tùy chỉnh màu sắc, font chữ, nội dung và các section của template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateConfigEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Menu</CardTitle>
                <CardDescription>
                  Thêm, sửa, xóa và ẩn/hiện các mục trong header menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSNavigationEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Ẩn/Hiện Sections</CardTitle>
                <CardDescription>
                  Bật hoặc tắt hiển thị các section trên trang chủ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSSectionsEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Chỉnh sửa banner chính, tiêu đề và nút CTA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSHeroEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
                <CardDescription>
                  Quản lý các con số hiển thị trong phần thống kê
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSStatsEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Tính năng</CardTitle>
                <CardDescription>
                  Chỉnh sửa các card tính năng với icon, tiêu đề và mô tả
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSFeaturesEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Call to Action</CardTitle>
                <CardDescription>
                  Tùy chỉnh các card CTA và form đăng ký
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSCTAEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Footer</CardTitle>
                <CardDescription>
                  Chỉnh sửa nội dung footer và liên kết mạng xã hội
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSFooterEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Logo & Footer</CardTitle>
                <CardDescription>
                  Quản lý logo header/footer và nội dung footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LogoFooterManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social-links">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Thêm, sửa, xóa hoặc ẩn các đường link social media trong footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialLinksManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="page-content">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Nội dung Trang</CardTitle>
                <CardDescription>
                  Chỉnh sửa nội dung cho 8 trang: Trang chủ, Giới thiệu, Lịch trình, Diễn giả, Startups, Địa điểm, FAQ, Liên hệ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Themes (10 Presets)</CardTitle>
                <CardDescription>
                  Chọn và tùy chỉnh 10 theme sẵn có cho trang chủ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomepageThemeManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Sessions</CardTitle>
                <CardDescription>
                  Thêm, sửa, xóa các buổi thuyết trình và workshop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speakers">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Diễn giả</CardTitle>
                <CardDescription>
                  Duyệt và quản lý thông tin diễn giả
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpeakersManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="startups">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Startups</CardTitle>
                <CardDescription>
                  Duyệt và quản lý thông tin các startup tham gia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StartupsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Người dùng</CardTitle>
                <CardDescription>
                  Xem thông tin người dùng đã đăng nhập và gán vai trò
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quản lý Liên hệ</CardTitle>
                <CardDescription>
                  Xem và quản lý các submission từ form liên hệ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactSubmissionsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Cài đặt trang</CardTitle>
                <CardDescription>
                  Cấu hình tên trang, logo, meta tags và ngày sự kiện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CMSSettingsEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
