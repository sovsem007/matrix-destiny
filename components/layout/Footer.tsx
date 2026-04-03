import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="space-y-3 max-w-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <span className="font-heading font-semibold text-foreground">Матрица Судьбы</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Инструмент для самопознания и исследования судьбы через нумерологию. Носит
              информационный и развлекательный характер.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Инструменты</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/matrix" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Матрица судьбы
                </Link>
                <Link href="/compatibility" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Совместимость
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Информация</h4>
              <nav className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">
                  Сервис носит развлекательный характер и не является научным, психологическим,
                  медицинским или юридическим заключением.
                </span>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Матрица Судьбы. Все права защищены.
          </p>
          <p className="text-xs text-muted-foreground">
            Информационный проект
          </p>
        </div>
      </div>
    </footer>
  );
}
