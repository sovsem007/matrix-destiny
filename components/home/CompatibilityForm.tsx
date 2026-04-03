"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, CalendarDays, User, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const dobField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Введите корректную дату")
  .refine((d) => {
    const date = new Date(d);
    return date <= new Date() && date.getFullYear() >= 1900;
  }, "Дата должна быть в прошлом и не ранее 1900 года");

const schema = z.object({
  name1: z.string().max(50).optional(),
  dateOfBirth1: dobField,
  name2: z.string().max(50).optional(),
  dateOfBirth2: dobField,
});

type FormValues = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormValues, string>>;

export function CompatibilityForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    name1: "",
    dateOfBirth1: "",
    name2: "",
    dateOfBirth2: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
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
    const params = new URLSearchParams({
      dob1: values.dateOfBirth1,
      dob2: values.dateOfBirth2,
    });
    if (values.name1?.trim()) params.set("name1", values.name1.trim());
    if (values.name2?.trim()) params.set("name2", values.name2.trim());
    router.push(`/compatibility?${params.toString()}`);
  }

  const maxDate = new Date().toISOString().split("T")[0];

  const personField = (
    idx: 1 | 2,
    nameKey: "name1" | "name2",
    dobKey: "dateOfBirth1" | "dateOfBirth2"
  ) => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">
          {idx}
        </span>
        Партнёр {idx}
      </h3>

      <div className="space-y-2">
        <Label htmlFor={`compat-name-${idx}`} className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          Имя <span className="text-muted-foreground font-normal">(необязательно)</span>
        </Label>
        <Input
          id={`compat-name-${idx}`}
          placeholder={idx === 1 ? "Ваше имя" : "Имя партнёра"}
          value={values[nameKey]}
          onChange={(e) => setValues((v) => ({ ...v, [nameKey]: e.target.value }))}
          className="transition-all duration-200 focus:border-violet-500/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`compat-dob-${idx}`} className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          Дата рождения <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`compat-dob-${idx}`}
          type="date"
          value={values[dobKey]}
          onChange={(e) => setValues((v) => ({ ...v, [dobKey]: e.target.value }))}
          aria-invalid={!!errors[dobKey]}
          aria-describedby={errors[dobKey] ? `compat-dob-${idx}-error` : undefined}
          max={maxDate}
          min="1900-01-01"
          className="transition-all duration-200 focus:border-violet-500/50"
          required
        />
        {errors[dobKey] && (
          <p id={`compat-dob-${idx}-error`} className="text-xs text-destructive" role="alert">
            {errors[dobKey]}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-400" />
          <h2 className="font-heading text-xl font-semibold">Совместимость</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Введите две даты рождения для анализа совместимости
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {personField(1, "name1", "dateOfBirth1")}

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <Heart className="h-4 w-4 text-rose-400/50 flex-shrink-0" />
          <Separator className="flex-1" />
        </div>

        {personField(2, "name2", "dateOfBirth2")}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-500 to-violet-600 text-white hover:from-rose-400 hover:to-violet-500 shadow-lg shadow-rose-500/20 h-12 text-base active:scale-[0.98] transition-all"
          disabled={loading}
          aria-label="Рассчитать совместимость"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Расчёт...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              Рассчитать совместимость
            </>
          )}
        </Button>
      </form>
    </GlassCard>
  );
}
