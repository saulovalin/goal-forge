import { z } from "zod";

const dueDateSchema = z.union([
  z.string().datetime(),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date"),
]);

export const goalSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(1000).optional().nullable(),
  category: z.string().trim().min(1).max(40).default("Pessoal"),
  dueDate: dueDateSchema.optional().nullable(),
});

export const checkpointSchema = z.object({ title: z.string().trim().min(1, "Title is required").max(160) });
export const goalUpdateSchema = goalSchema.partial().refine((data) => Object.keys(data).length > 0, "Provide at least one field to update");
export const checkpointUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160).optional(),
  completed: z.boolean().optional(),
}).refine((data) => data.title !== undefined || data.completed !== undefined, "Provide at least one field to update");
