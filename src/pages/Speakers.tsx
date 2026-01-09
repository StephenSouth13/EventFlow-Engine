import { Layout } from "@/components/layout/Layout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Twitter, Globe, Mic2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Speakers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const { data: speakers, isLoading } = useQuery({
    queryKey: ["speakers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("speakers")
        .select("*")
        .eq("is_approved", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const displaySpeakers = speakers || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Mic2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Diễn giả</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Các <span className="gradient-text">Diễn giả</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Học hỏi từ những nhà lãnh đạo ngành, doanh nhân thành công và nhà đầu tư có tầm nhìn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" ref={ref}>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))
            ) : displaySpeakers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Chưa có diễn giả</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Danh sách diễn giả sẽ được cập nhật sớm. Hãy theo dõi để không bỏ lỡ!
                </p>
              </motion.div>
            ) : (
              displaySpeakers.map((speaker, index) => (
                <motion.div
                  key={speaker.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-500 group overflow-hidden">
                    {/* Gradient top border */}
                    <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardContent className="p-8">
                      <div className="relative mb-6">
                        {/* Avatar with glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl scale-75 group-hover:scale-100 transition-transform" />
                        <Avatar className="w-28 h-28 mx-auto relative ring-4 ring-background group-hover:ring-primary/20 transition-all">
                          <AvatarImage 
                            src={speaker.photo_url || undefined} 
                            alt={speaker.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-3xl font-display font-bold gradient-primary text-primary-foreground">
                            {speaker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="font-display text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                          {speaker.name}
                        </h3>
                        <p className="text-primary font-medium text-sm mb-1">
                          {speaker.title}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          {speaker.company}
                        </p>
                        
                        {speaker.bio && (
                          <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                            {speaker.bio}
                          </p>
                        )}
                        
                        <div className="flex justify-center gap-3">
                          {speaker.linkedin_url && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={speaker.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                            >
                              <Linkedin className="w-5 h-5" />
                            </motion.a>
                          )}
                          {speaker.twitter_url && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={speaker.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                            >
                              <Twitter className="w-5 h-5" />
                            </motion.a>
                          )}
                          {speaker.website_url && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={speaker.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                            >
                              <Globe className="w-5 h-5" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
