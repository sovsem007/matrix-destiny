import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateMatrix } from "@/lib/numerology/matrix-engine";
import type { ApiMatrixRequest, ApiResponse, MatrixResult } from "@/types";

const schema = z.object({
  name: z.string().max(50).optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Формат даты: YYYY-MM-DD")
    .refine((d) => {
      const date = new Date(d);
      return !isNaN(date.getTime()) && date <= new Date() && date.getFullYear() >= 1900;
    }, "Некорректная дата"),
});

export async function POST(request: Request) {
  try {
    const body: ApiMatrixRequest = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const result = calculateMatrix(parsed.data.dateOfBirth, parsed.data.name);

    return NextResponse.json<ApiResponse<MatrixResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[POST /api/matrix]", error);
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
