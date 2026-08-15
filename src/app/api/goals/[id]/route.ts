import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { goalUpdateSchema } from "@/lib/validation";
import { apiError, validationError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  try {
    const { id } = await params;
    const goal = await prisma.goal.findUnique({ where: { id }, include: { checkpoints: { orderBy: { order: "asc" } } } });
    return goal ? NextResponse.json(goal) : NextResponse.json({ error: "Goal not found" }, { status: 404 });
  } catch (error) { return apiError(error, "Goal not found"); }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const parsed = goalUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.issues[0]?.message);
    const goal = await prisma.goal.update({ where: { id }, data: { ...parsed.data, dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : parsed.data.dueDate } });
    return NextResponse.json(goal);
  } catch (error) { return apiError(error, "Goal not found"); }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { id } = await params;
    await prisma.goal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error, "Goal not found"); }
}
