import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { MatrixForm } from "@/components/home/MatrixForm";
import { CompatibilityForm } from "@/components/home/CompatibilityForm";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { DisclaimerSection } from "@/components/home/DisclaimerSection";

export const metadata: Metadata = {
  title: "Матрица Судьбы — Нумерология и Совместимость",
  description:
    "Рассчитайте личную матрицу судьбы по дате рождения. Узнайте предназначение, сильные стороны и совместимость с партнёром.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection />

      {/* Forms section */}
      <section className="py-8 md:py-16" id="calculator">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <MatrixForm />
            <CompatibilityForm />
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorksSection />

      {/* Disclaimer */}
      <DisclaimerSection />
    </div>
  );
}
