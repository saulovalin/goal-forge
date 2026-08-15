import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { goalSchema } from "@/lib/validation";
import { apiError, validationError } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const status = new URL(request.url).searchParams.get("status");
    const where = status === "completed" ? { progress: 100 } : status === "all" ? {} : { progress: { lt: 100 } };
    const goals = await prisma.goal.findMany({ where, include: { checkpoints: { orderBy: { order: "asc" } } }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(goals);
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const parsed = goalSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.issues[0]?.message);
    const goal = await prisma.goal.create({ data: { ...parsed.data, description: parsed.data.description || null, dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null } });
    return NextResponse.json(goal, { status: 201 });
  } catch (error) { return apiError(error); }
}
