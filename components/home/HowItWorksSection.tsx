"use client";

import { motion } from "framer-motion";
import { CalendarDays, Calculator, Eye, Sparkles } from "lucide-react";

const steps = [
  {
    icon: CalendarDays,
    title: "Введите дату рождения",
    description:
      "Дата рождения содержит числовой код вашей судьбы. Введите её в форму расчёта.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Calculator,
    title: "Алгоритм строит матрицу",
    description:
      "Числа проходят нумерологическую обработку: дата разбивается на базовые числа, которые затем раскладываются по 9 позициям октаграммы.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Eye,
    title: "Визуализация матрицы",
    description:
      "Каждая позиция соответствует одному из 22 Арканов. Вы видите схему матрицы и значение каждой энергии.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "Подробная расшифровка",
    description:
      "Получите описание своего предназначения, отношений, финансовой энергии, талантов и зон роста.",
    color: "text-gold-400",
    bg: "bg-gold-500/10",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Как это работает
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Матрица судьбы — это нумерологическая система, которая раскрывает
            ключевые энергии человека через числа его даты рождения.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="rounded-2xl border border-border/50 bg-card p-6 h-full hover:border-violet-500/30 transition-colors duration-300 group">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-background border border-border text-xs font-bold flex items-center justify-center text-muted-foreground">
                  {i + 1}
                </div>

                <div className={`inline-flex p-3 rounded-xl ${step.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>

                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
