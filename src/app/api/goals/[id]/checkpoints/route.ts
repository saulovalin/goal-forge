import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkpointSchema } from "@/lib/validation";
import { calculateGoalProgress } from "@/lib/goals";
import { apiError, validationError } from "@/lib/api";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = checkpointSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.issues[0]?.message);

    const checkpoint = await prisma.$transaction(async (tx) => {
      const goal = await tx.goal.findUnique({ where: { id }, select: { id: true } });
      if (!goal) return null;
      const order = await tx.checkpoint.count({ where: { goalId: id } });
      const created = await tx.checkpoint.create({ data: { ...parsed.data, goalId: id, order } });
      const checkpoints = await tx.checkpoint.findMany({ where: { goalId: id }, select: { completed: true } });
      const progress = calculateGoalProgress(checkpoints);
      await tx.goal.update({ where: { id }, data: { progress, completedAt: progress === 100 ? new Date() : null } });
      return created;
    });

    return checkpoint
      ? NextResponse.json(checkpoint, { status: 201 })
      : NextResponse.json({ error: "Goal not found" }, { status: 404 });
  } catch (error) { return apiError(error, "Goal not found"); }
}
