'use client';

import { motion } from 'framer-motion';
import { Terminal, Code2, Cpu, Network } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-deep-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex flex-col justify-center max-w-5xl">
        
        {/* Header with terminal prompt */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-neon-cyan font-mono text-sm mb-4">
            <Terminal size={16} />
            <span className="opacity-60">~/justin-beaudry</span>
            <span className="opacity-40">$</span>
            <span className="animate-pulse">_</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tight">
            Justin Beaudry
          </h1>
          
          <div className="flex items-center gap-3 text-neon-cyan/80 text-sm font-mono">
            <Code2 size={16} />
            <span>Engineer & Architect</span>
            <span className="text-neon-cyan/40">|</span>
            <Cpu size={16} />
            <span>AI-First Systems</span>
          </div>
        </motion.div>

        {/* Bio content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6 text-white/90 text-lg leading-relaxed max-w-3xl"
        >
          <p className="border-l-2 border-neon-cyan/40 pl-6">
            I am an Engineer and Architect focused on the transition from legacy workflows to AI-first systems.
          </p>
          
          <p>
            After a decade scaling high-growth startups and enterprise platforms in San Francisco and Austin, 
            I returned to Northwest Ohio with a deliberate mission: <span className="text-neon-cyan font-semibold">to bridge 
            the gap between Silicon Valley scale and Midwest talent.</span>
          </p>
          
          <p>
            Currently, I direct engineering at <span className="text-white font-semibold">Actual Reality Technologies</span> and{' '}
            <span className="text-white font-semibold">EmpoweredAI</span>, building generative solutions and 
            high-throughput data systems. I founded <span className="text-white font-semibold">Toledo Codes</span> and 
            the <span className="text-white font-semibold">AI Collective Toledo Chapter</span>, and now focus on 
            expanding the Collective across the Midwest.
          </p>
          
          <p className="text-neon-cyan/70 italic border-l-2 border-neon-cyan/20 pl-6">
            My work explores what happens to our relationship with code as we move toward orchestrating 
            complex language and world models.
          </p>
        </motion.div>

        {/* Decorative data overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center gap-8 text-neon-cyan/30 font-mono text-xs"
        >
          <div className="flex items-center gap-2">
            <Network size={14} />
            <span>MIDWEST.US</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span>ONLINE</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/20 to-transparent" />
        </motion.div>

      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-neon-cyan/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-neon-cyan/20" />
    </main>
  );
}
