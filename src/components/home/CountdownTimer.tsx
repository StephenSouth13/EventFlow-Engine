import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCMSSettings } from "@/hooks/useCMS";

interface TimeUnit {
  value: number;
  label: string;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);
  const { data: settings } = useCMSSettings();

  useEffect(() => {
    const eventDateString = settings?.event_start_date;
    const eventDate = eventDateString ? new Date(eventDateString) : new Date("2026-04-15T09:00:00");

    const calculateTimeLeft = () => {
      const difference = eventDate.getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft([
          { value: days, label: "Days" },
          { value: hours, label: "Hours" },
          { value: minutes, label: "Minutes" },
          { value: seconds, label: "Seconds" },
        ]);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [settings?.event_start_date]);

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6">
      {timeLeft.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-xl mb-2">
            <span className="font-display text-2xl md:text-4xl font-bold gradient-text">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
