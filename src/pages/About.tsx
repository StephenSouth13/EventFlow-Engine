import { Layout } from "@/components/layout/Layout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Users, Globe, Award, Sparkles, TrendingUp, Lightbulb, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Lightbulb,
    title: "Đổi mới sáng tạo",
    description: "Thúc đẩy những ý tưởng đột phá định hình tương lai công nghệ Việt Nam.",
  },
  {
    icon: Users,
    title: "Cộng đồng mạnh mẽ",
    description: "Xây dựng hệ sinh thái nơi founders, investors và mentors cùng phát triển.",
  },
  {
    icon: Globe,
    title: "Tầm nhìn toàn cầu",
    description: "Kết nối startup Việt với cơ hội vươn ra thế giới.",
  },
  {
    icon: Award,
    title: "Xuất sắc vượt trội",
    description: "Tôn vinh những thành tựu nổi bật trong hệ sinh thái startup.",
  },
];

const stats = [
  { value: "8+", label: "Năm tổ chức", icon: Sparkles },
  { value: "500+", label: "Startup tham gia", icon: TrendingUp },
  { value: "50M+", label: "USD đầu tư", icon: Target },
  { value: "10K+", label: "Người tham dự", icon: Heart },
];

export default function About() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Về chúng tôi</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Startup & Innovation
              <br />
              <span className="gradient-text">Spring Festival</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Sự kiện khởi nghiệp hàng đầu Đông Nam Á, nơi kết nối những founders tài năng 
              với các nhà đầu tư hàng đầu và chuyên gia trong ngành.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-transparent via-primary/5 to-transparent" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 text-center relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-8">
                Sứ mệnh <span className="gradient-text">của chúng tôi</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Chúng tôi cam kết dân chủ hóa khả năng tiếp cận nguồn lực, mentorship 
                  và vốn đầu tư cho các startup tại Việt Nam và khu vực.
                </p>
                <p>
                  SISF là bệ phóng cho những ý tưởng đổi mới, cầu nối giữa các founder 
                  có tầm nhìn và những nhà đầu tư tiên phong.
                </p>
                <p>
                  Thông qua các phiên chia sẻ, workshop thực hành và cơ hội networking 
                  chiến lược, chúng tôi trao quyền cho entrepreneurs đưa startup lên tầm cao mới.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 p-1">
                <div className="w-full h-full rounded-[22px] bg-card/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_70%)]" />
                  <div className="text-center relative z-10 p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", bounce: 0.4, delay: 0.5 }}
                      className="font-display text-7xl md:text-8xl font-bold gradient-text mb-4"
                    >
                      2026
                    </motion.div>
                    <div className="text-xl text-muted-foreground">Phiên bản lớn nhất từ trước đến nay</div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow"
              >
                #1 Startup Event
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold"
              >
                SEA Region
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-card/50 to-transparent" ref={ref}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Giá trị <span className="gradient-text">cốt lõi</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-500 group">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow"
                    >
                      <value.icon className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
