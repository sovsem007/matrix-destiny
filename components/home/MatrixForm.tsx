"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, User, Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/card";

const schema = z.object({
  name: z.string().max(50).optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Введите корректную дату")
    .refine((d) => {
      const date = new Date(d);
      const now = new Date();
      return date <= now && date.getFullYear() >= 1900;
    }, "Дата должна быть в прошлом и не ранее 1900 года"),
});

type FormValues = z.infer<typeof schema>;

export function MatrixForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({ name: "", dateOfBirth: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const params = new URLSearchParams({ dob: values.dateOfBirth });
    if (values.name?.trim()) params.set("name", values.name.trim());
    router.push(`/matrix?${params.toString()}`);
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h2 className="font-heading text-xl font-semibold">Матрица судьбы</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Введите дату рождения для расчёта персональной матрицы
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="matrix-name" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Имя <span className="text-muted-foreground font-normal">(необязательно)</span>
          </Label>
          <Input
            id="matrix-name"
            placeholder="Ваше имя"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "matrix-name-error" : undefined}
            className="transition-all duration-200 focus:border-violet-500/50"
          />
          {errors.name && (
            <p id="matrix-name-error" className="text-xs text-destructive" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="matrix-dob" className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            Дата рождения <span className="text-destructive">*</span>
          </Label>
          <Input
            id="matrix-dob"
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => setValues((v) => ({ ...v, dateOfBirth: e.target.value }))}
            aria-invalid={!!errors.dateOfBirth}
            aria-describedby={errors.dateOfBirth ? "matrix-dob-error" : undefined}
            max={new Date().toISOString().split("T")[0]}
            min="1900-01-01"
            className="transition-all duration-200 focus:border-violet-500/50"
            required
          />
          {errors.dateOfBirth && (
            <p id="matrix-dob-error" className="text-xs text-destructive" role="alert">
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="mystic"
          size="lg"
          className="w-full"
          disabled={loading}
          aria-label="Рассчитать матрицу судьбы"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Расчёт...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Рассчитать матрицу
            </>
          )}
        </Button>
      </form>
    </GlassCard>
  );
}
