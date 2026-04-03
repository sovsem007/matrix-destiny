import { AlertCircle } from "lucide-react";

export function DisclaimerSection() {
  return (
    <section className="py-8">
      <div className="container">
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4 md:p-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Важная информация</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Данный сервис носит исключительно развлекательный и информационный характер.
              Результаты расчётов не являются научным, психологическим, медицинским,
              юридическим или финансовым заключением. Матрица судьбы — это один из инструментов
              самопознания, основанный на нумерологической традиции. Принимайте жизненные
              решения самостоятельно, при необходимости консультируясь с соответствующими
              специалистами.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
