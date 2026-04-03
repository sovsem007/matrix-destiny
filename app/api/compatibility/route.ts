import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateMatrix } from "@/lib/numerology/matrix-engine";
import { calculateCompatibility } from "@/lib/numerology/compatibility-engine";
import type { ApiCompatibilityRequest, ApiResponse, CompatibilityResult } from "@/types";

const dobField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Формат даты: YYYY-MM-DD")
  .refine((d) => {
    const date = new Date(d);
    return !isNaN(date.getTime()) && date <= new Date() && date.getFullYear() >= 1900;
  }, "Некорректная дата");

const schema = z.object({
  name1: z.string().max(50).optional(),
  dateOfBirth1: dobField,
  name2: z.string().max(50).optional(),
  dateOfBirth2: dobField,
});

export async function POST(request: Request) {
  try {
    const body: ApiCompatibilityRequest = await request.json();
    const parsed = schema.safeParse({
      name1: body.name1,
      dateOfBirth1: body.dateOfBirth1,
      name2: body.name2,
      dateOfBirth2: body.dateOfBirth2,
    });

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { dateOfBirth1, name1, dateOfBirth2, name2 } = parsed.data;
    const matrixA = calculateMatrix(dateOfBirth1, name1);
    const matrixB = calculateMatrix(dateOfBirth2, name2);
    const result = calculateCompatibility(matrixA, matrixB);

    return NextResponse.json<ApiResponse<CompatibilityResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[POST /api/compatibility]", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
