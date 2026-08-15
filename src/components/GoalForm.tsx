"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { categoryLabel, goalCategories } from "@/lib/categories";

type Initial = { id?: string; title?: string; description?: string | null; category?: string; dueDate?: Date | string | null };

export function GoalForm({ initial = {}, onDone, onClose }: { initial?: Initial; onDone: () => void; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setSaving(true); setError("");
    const rawDate = String(formData.get("dueDate") || "");
    const payload = { title: formData.get("title"), description: formData.get("description"), category: formData.get("category"), dueDate: rawDate ? new Date(`${rawDate}T12:00:00`).toISOString() : null };
    const response = await fetch(initial.id ? `/api/goals/${initial.id}` : "/api/goals", { method: initial.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) { const data = await response.json(); setError(data.error || "We couldn't save this goal"); setSaving(false); return; }
    onDone();
  }
  const date = initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : "";
  return <div role="dialog" aria-modal="true" aria-labelledby="goal-form-title" className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#102219]/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <form action={submit} className="card max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-[#327653]">{initial.id ? "Edit" : "New journey"}</p><h2 id="goal-form-title" className="mt-1 text-xl font-black sm:text-2xl">{initial.id ? "Update your goal" : "What's your next goal?"}</h2></div><button type="button" onClick={onClose} aria-label="Close form" className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f805b]"><X/></button></div>
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-bold">Title<input required name="title" defaultValue={initial.title} placeholder="E.g. Run my first half marathon" className="field mt-1.5"/></label>
        <label className="block text-sm font-bold">Description<textarea name="description" defaultValue={initial.description || ""} rows={3} placeholder="Why does this goal matter?" className="field mt-1.5 resize-none"/></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Category<select name="category" defaultValue={categoryLabel(initial.category || "Personal")} className="field mt-1.5">{goalCategories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="block text-sm font-bold">Due date<input type="date" name="dueDate" defaultValue={date} className="field mt-1.5"/></label></div>
      </div>
      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="btn btn-soft">Cancel</button><button disabled={saving} aria-disabled={saving} className="btn btn-primary">{saving ? "Saving..." : "Save goal"}</button></div>
    </form>
  </div>;
}
