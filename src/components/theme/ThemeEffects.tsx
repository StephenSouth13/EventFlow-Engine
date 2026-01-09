import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
    size: 8 + Math.random() * 16,
  }));
}

function SnowEffect() {
  const [particles] = useState(() => generateParticles(30));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-white/60"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
}

function LeafEffect() {
  const [particles] = useState(() => generateParticles(20));
  const leaves = ['🍂', '🍁', '🍃'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -50, x: 0, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '100vh', 
            x: [0, 30, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 1, 0] 
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {leaves[p.id % leaves.length]}
        </motion.div>
      ))}
    </div>
  );
}

function PetalEffect() {
  const [particles] = useState(() => generateParticles(25));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-pink-300"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -50, x: 0, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '100vh', 
            x: [0, 20, -20, 10],
            rotate: [0, 90, 180],
            opacity: [0, 0.8, 0.8, 0] 
          }}
          transition={{
            duration: p.duration + 3,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}

function HeartEffect() {
  const [particles] = useState(() => generateParticles(15));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size, bottom: -50 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 1],
          }}
          transition={{
            duration: p.duration + 5,
            delay: p.delay * 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
}

function LunarEffect() {
  const [particles] = useState(() => generateParticles(20));
  const items = ['🧧', '🏮', '🎊'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ 
            y: '100vh',
            x: [0, 15, -15, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration + 2,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {items[p.id % items.length]}
        </motion.div>
      ))}
    </div>
  );
}

function HalloweenEffect() {
  const [particles] = useState(() => generateParticles(12));
  const items = ['🎃', '👻', '🦇'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size, top: '20%' }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {items[p.id % items.length]}
        </motion.div>
      ))}
    </div>
  );
}

function ConfettiEffect() {
  const [particles] = useState(() => generateParticles(40));
  const colors = ['🎊', '🎉', '✨', '⭐'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, fontSize: p.size }}
          initial={{ y: -50, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '100vh',
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration / 2,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {colors[p.id % colors.length]}
        </motion.div>
      ))}
    </div>
  );
}

export function ThemeEffects() {
  const { season, festive, effectsEnabled } = useTheme();
  
  if (!effectsEnabled) return null;
  
  // Festive effects take priority
  if (festive === 'christmas') return <SnowEffect />;
  if (festive === 'lunar-new-year') return <LunarEffect />;
  if (festive === 'valentine') return <HeartEffect />;
  if (festive === 'halloween') return <HalloweenEffect />;
  if (festive === 'new-year') return <ConfettiEffect />;
  
  // Season effects
  if (season === 'winter') return <SnowEffect />;
  if (season === 'autumn') return <LeafEffect />;
  if (season === 'spring') return <PetalEffect />;
  
  return null;
}
