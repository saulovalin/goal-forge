import type { Checkpoint, Goal } from "@prisma/client";

export type GoalWithCheckpoints = Goal & { checkpoints: Checkpoint[] };

export function calculateGoalProgress(checkpoints: ReadonlyArray<{ completed: boolean }>) {
  if (checkpoints.length === 0) return 0;

  const completed = checkpoints.filter((checkpoint) => checkpoint.completed).length;
  return Math.round((completed / checkpoints.length) * 100);
}

export function progressOf(goal: GoalWithCheckpoints) {
  return goal.progress;
}

export function isGoalCompleted(goal: Pick<Goal, "progress">) {
  return goal.progress === 100;
}
