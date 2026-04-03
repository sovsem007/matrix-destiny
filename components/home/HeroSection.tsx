"use client";

import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl dark:bg-violet-600/15" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-3xl" />
        {/* Decorative stars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-violet-400/30 dark:text-violet-400/20"
            style={{
              top: `${15 + i * 12}%`,
              left: `${5 + i * 15}%`,
              fontSize: i % 2 === 0 ? "12px" : "8px",
            }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      <div className="container flex flex-col items-center text-center gap-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Нумерология · Матрица судьбы · Совместимость</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 max-w-3xl"
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Раскройте тайны
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-gold-400 bg-clip-text text-transparent">
              вашей судьбы
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Персональная матрица судьбы по дате рождения — узнайте свои ключевые энергии,
            предназначение и совместимость с близкими через древнюю систему нумерологии.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button asChild variant="mystic" size="xl">
            <Link href="/matrix">
              <Star className="h-5 w-5" />
              Рассчитать матрицу
            </Link>
          </Button>
          <Button asChild variant="mystic-outline" size="xl">
            <Link href="/compatibility">
              Совместимость пары
            </Link>
          </Button>
        </motion.div>

        {/* Animated matrix preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 relative"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Decorative octagram */}
            <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow opacity-20">
              <polygon
                points="100,10 120,80 190,80 135,125 155,195 100,155 45,195 65,125 10,80 80,80"
                fill="none"
                stroke="url(#heroGrad)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>
            {/* Inner glowing circle */}
            <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-600/20 blur-lg animate-pulse-glow" />
            <div className="absolute inset-1/3 rounded-full bg-gradient-to-br from-violet-400/40 to-gold-400/20 blur-md" />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 pt-4"
        >
          {[
            { value: "22", label: "Арканa" },
            { value: "9", label: "позиций матрицы" },
            { value: "4", label: "сферы жизни" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-violet-400">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
