"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Edit3, Plus, Save, Trash2, X } from "lucide-react";
import type { GoalWithCheckpoints } from "@/lib/goals";
import { isGoalCompleted, progressOf } from "@/lib/goals";
import { formatDateBR } from "@/lib/date";
import { GoalForm } from "./GoalForm";
import { GoalProgress } from "./GoalProgress";
import { categoryLabel } from "@/lib/categories";

type Props = {
  goal: GoalWithCheckpoints;
  refresh: () => void | Promise<void>;
  showUpdatedAt?: boolean;
  onDeleted?: () => void;
};

export function GoalCard({ goal, refresh, showUpdatedAt = false, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingCheckpoint, setEditingCheckpoint] = useState<string | null>(null);
  const [error, setError] = useState("");
  const progress = progressOf(goal);
  const completedCount = goal.checkpoints.filter((item) => item.completed).length;

  async function request(url: string, init: RequestInit) {
    setError("");
    const response = await fetch(url, init);
    if (!response.ok) {
      const data = await response.json().catch(() => null) as { error?: string } | null;
      setError(data?.error || "We couldn't complete this action.");
      return false;
    }
    return true;
  }

  async function toggle(id: string, completed: boolean) {
    if (await request(`/api/checkpoints/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed }) })) await refresh();
  }

  async function add(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    if (!title) { setError("Enter a checkpoint title."); return; }
    if (await request(`/api/goals/${goal.id}/checkpoints`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) })) { setAdding(false); await refresh(); }
  }

  async function updateCheckpoint(formData: FormData) {
    if (!editingCheckpoint) return;
    const title = String(formData.get("title") || "").trim();
    if (!title) { setError("Enter a checkpoint title."); return; }
    if (await request(`/api/checkpoints/${editingCheckpoint}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) })) { setEditingCheckpoint(null); await refresh(); }
  }

  async function removeCheckpoint(id: string, title: string) {
    if (!window.confirm(`Delete checkpoint “${title}”?`)) return;
    if (await request(`/api/checkpoints/${id}`, { method: "DELETE" })) await refresh();
  }

  async function removeGoal() {
    if (!window.confirm(`Delete goal “${goal.title}” and all of its checkpoints?`)) return;
    if (await request(`/api/goals/${goal.id}`, { method: "DELETE" })) {
      if (onDeleted) onDeleted();
      else await refresh();
    }
  }

  const footerDate = showUpdatedAt
    ? `Updated on ${formatDateBR(goal.updatedAt) ?? "date unavailable"}`
    : isGoalCompleted(goal) && goal.completedAt
      ? `Completed on ${formatDateBR(goal.completedAt) ?? "date unavailable"}`
      : goal.dueDate ? `Due: ${formatDateBR(goal.dueDate) ?? "date unavailable"}` : "No due date";

  return <><article className="card group relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:border-[#b8cabd] hover:shadow-lg sm:p-5">
    <Link href={`/metas/${goal.id}`} aria-label={`Open goal ${goal.title}`} className="absolute inset-0 z-10 rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f805b] focus-visible:ring-offset-2"/>
    <div className="pointer-events-none relative z-20 flex items-start justify-between gap-3">
      <div className="min-w-0"><span className="rounded-full bg-[#edf3e7] px-2.5 py-1 text-xs font-bold text-[#3f6b4d]">{categoryLabel(goal.category)}</span><h3 className="mt-3 text-lg font-black leading-tight">{goal.title}</h3>{goal.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#69736d]">{goal.description}</p>}</div>
      <div className="pointer-events-auto flex shrink-0"><button onClick={() => setEditing(true)} aria-label="Edit goal" className="grid size-10 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f805b]"><Edit3 size={17}/></button><button onClick={removeGoal} aria-label="Delete goal" className="grid size-10 place-items-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"><Trash2 size={17}/></button></div>
    </div>
    <div className="pointer-events-none relative z-20 mt-5"><GoalProgress progress={progress} label={`${completedCount} of ${goal.checkpoints.length} tasks`}/></div>
    <div className="pointer-events-none relative z-20 mt-4 space-y-2">
      {goal.checkpoints.map((item) => editingCheckpoint === item.id
        ? <form key={item.id} action={updateCheckpoint} className="pointer-events-auto flex flex-col gap-2 sm:flex-row"><input name="title" aria-label="Checkpoint title" required autoFocus defaultValue={item.title} className="field min-w-0 py-2"/><div className="flex gap-2"><button aria-label="Save checkpoint" className="btn btn-primary min-h-10 flex-1 px-3 sm:flex-none"><Save size={16}/></button><button type="button" onClick={() => setEditingCheckpoint(null)} aria-label="Cancel editing" className="btn btn-soft min-h-10 flex-1 px-3 sm:flex-none"><X size={16}/></button></div></form>
        : <div key={item.id} className="flex items-center gap-2 rounded-lg bg-[#f7f8f4] p-2.5 text-sm">
          <label className="pointer-events-auto flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-1"><input type="checkbox" checked={item.completed} onChange={(event) => void toggle(item.id, event.target.checked)} className="size-5 shrink-0 accent-[#39835b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f805b]"/><span className={item.completed ? "break-words text-gray-400 line-through" : "break-words"}>{item.title}</span></label>
          <button onClick={() => setEditingCheckpoint(item.id)} aria-label={`Edit ${item.title}`} className="pointer-events-auto grid size-10 shrink-0 place-items-center rounded-md text-gray-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f805b]"><Edit3 size={16}/></button>
          <button onClick={() => void removeCheckpoint(item.id, item.title)} aria-label={`Delete ${item.title}`} className="pointer-events-auto grid size-10 shrink-0 place-items-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"><Trash2 size={16}/></button>
        </div>)}
    </div>
    {adding ? <form action={add} className="pointer-events-auto relative z-20 mt-3 flex flex-col gap-2 sm:flex-row"><input name="title" aria-label="New checkpoint title" required autoFocus placeholder="New checkpoint" className="field min-w-0 py-2"/><div className="flex gap-2"><button className="btn btn-primary min-h-10 flex-1 px-3 sm:flex-none">Add</button><button type="button" onClick={() => setAdding(false)} aria-label="Cancel" className="btn btn-soft min-h-10 flex-1 px-3 sm:flex-none"><X size={16}/></button></div></form> : <button onClick={() => setAdding(true)} className="pointer-events-auto relative z-20 mt-3 flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-bold text-[#36734f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f805b]"><Plus size={16}/>Add checkpoint</button>}
    {error && <p role="alert" className="pointer-events-none relative z-20 mt-3 text-sm font-semibold text-red-700">{error}</p>}
    <div className="pointer-events-none relative z-20 mt-5 flex items-center gap-2 border-t border-[#e7eae5] pt-4 text-xs text-[#78817c]"><CalendarDays className="shrink-0" size={15}/><span className="break-words">{footerDate}</span></div>
  </article>{editing && <GoalForm initial={goal} onClose={() => setEditing(false)} onDone={() => { setEditing(false); void refresh(); }}/>}</>;
}
