import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function apiError(error: unknown, notFoundMessage = "Resource not found") {
  if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return NextResponse.json({ error: notFoundMessage }, { status: 404 });
  }
  console.error("API error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function validationError(message?: string) {
  return NextResponse.json({ error: message ?? "Invalid data" }, { status: 400 });
}
