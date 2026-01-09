import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Sparkles, Coffee, Mic2, Lightbulb, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const days = [
  { id: 1, date: "15 Tháng 4", label: "Ngày 1", description: "Khai mạc & Keynotes" },
  { id: 2, date: "16 Tháng 4", label: "Ngày 2", description: "Workshops & Pitching" },
  { id: 3, date: "17 Tháng 4", label: "Ngày 3", description: "Demo Day & Networking" },
];

const sessionTypeConfig: Record<string, { color: string; icon: any; label: string }> = {
  keynote: { color: "from-primary to-primary/70", icon: Mic2, label: "Keynote" },
  panel: { color: "from-purple-500 to-purple-600", icon: Users, label: "Panel" },
  workshop: { color: "from-green-500 to-emerald-600", icon: Lightbulb, label: "Workshop" },
  networking: { color: "from-blue-500 to-cyan-600", icon: Handshake, label: "Networking" },
  pitch: { color: "from-orange-500 to-red-500", icon: Sparkles, label: "Pitch" },
  talk: { color: "from-indigo-500 to-violet-600", icon: Mic2, label: "Talk" },
  break: { color: "from-gray-400 to-gray-500", icon: Coffee, label: "Break" },
};

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(1);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const displaySessions = sessions || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Lịch trình sự kiện</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Lịch trình <span className="gradient-text">SISF 2026</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Ba ngày với những phiên chia sẻ đầy cảm hứng, workshop thực hành và cơ hội networking
            </p>
          </motion.div>

          {/* Day Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {days.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Button
                  variant={selectedDay === day.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedDay(day.id)}
                  className={`h-auto py-4 px-6 flex flex-col items-start min-w-[160px] transition-all ${
                    selectedDay === day.id 
                      ? "gradient-primary shadow-glow" 
                      : "hover:border-primary/50"
                  }`}
                >
                  <span className="font-display text-lg font-bold">{day.label}</span>
                  <span className={`text-sm ${selectedDay === day.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {day.date}
                  </span>
                  <span className={`text-xs mt-1 ${selectedDay === day.id ? "text-primary-foreground/60" : "text-muted-foreground/70"}`}>
                    {day.description}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Sessions Timeline */}
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : displaySessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Chưa có lịch trình</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Lịch trình chi tiết sẽ được cập nhật sớm. Hãy theo dõi để không bỏ lỡ!
                </p>
              </motion.div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

                <div className="space-y-4">
                  {displaySessions.map((session, index) => {
                    const config = sessionTypeConfig[session.session_type] || sessionTypeConfig.talk;
                    const Icon = config.icon;
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        className="relative"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block z-10" />
                        
                        <Card className="md:ml-16 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-300 overflow-hidden group">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              {/* Time column */}
                              <div className="md:w-32 p-5 bg-muted/30 flex md:flex-col items-center md:items-start justify-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <div className="text-sm font-semibold">
                                  {format(new Date(session.start_time), "HH:mm")}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(session.end_time), "HH:mm")}
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex-1">
                                    <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">
                                      {session.title}
                                    </h3>
                                    {session.description && (
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {session.description}
                                      </p>
                                    )}
                                  </div>
                                  <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 shrink-0`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    {config.label}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  {session.location && (
                                    <span className="flex items-center gap-1.5">
                                      <MapPin className="w-4 h-4 text-primary/70" />
                                      {session.location}
                                    </span>
                                  )}
                                  {session.track && (
                                    <span className="flex items-center gap-1.5">
                                      <Sparkles className="w-4 h-4 text-primary/70" />
                                      {session.track}
                                    </span>
                                  )}
                                  {session.max_capacity && (
                                    <span className="flex items-center gap-1.5">
                                      <Users className="w-4 h-4 text-primary/70" />
                                      {session.max_capacity} chỗ
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
