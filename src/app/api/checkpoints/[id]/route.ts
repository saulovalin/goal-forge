import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateGoalProgress } from "@/lib/goals";
import { checkpointUpdateSchema } from "@/lib/validation";
import { apiError, validationError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const parsed = checkpointUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return validationError(parsed.error.issues[0]?.message);

    const checkpoint = await prisma.$transaction(async (tx) => {
      const updated = await tx.checkpoint.update({ where: { id }, data: parsed.data });
      const checkpoints = await tx.checkpoint.findMany({ where: { goalId: updated.goalId }, select: { completed: true } });
      const progress = calculateGoalProgress(checkpoints);
      await tx.goal.update({ where: { id: updated.goalId }, data: { progress, completedAt: progress === 100 ? new Date() : null } });
      return updated;
    });
    return NextResponse.json(checkpoint);
  } catch (error) { return apiError(error, "Checkpoint not found"); }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { id } = await params;
    await prisma.$transaction(async (tx) => {
      const deleted = await tx.checkpoint.delete({ where: { id } });
      const checkpoints = await tx.checkpoint.findMany({ where: { goalId: deleted.goalId }, select: { completed: true } });
      const progress = calculateGoalProgress(checkpoints);
      await tx.goal.update({ where: { id: deleted.goalId }, data: { progress, completedAt: progress === 100 ? new Date() : null } });
    });
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error, "Checkpoint not found"); }
}
