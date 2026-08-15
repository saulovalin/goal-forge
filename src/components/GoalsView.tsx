"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Plus, Target, TrendingUp } from "lucide-react";
import type { GoalWithCheckpoints } from "@/lib/goals";
import { isGoalCompleted, progressOf } from "@/lib/goals";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";

export function GoalsView({ completedOnly = false }: { completedOnly?: boolean }) {
  const [goals, setGoals] = useState<GoalWithCheckpoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const endpoint = completedOnly ? "/api/goals?status=completed" : "/api/goals?status=all";
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) throw new Error();
      setGoals(await response.json());
    } catch { setError("We couldn't load your goals. Please try again."); }
    finally { setLoading(false); }
  }, [completedOnly]);

  useEffect(() => { void load(); }, [load]);
  const active = goals.filter((goal) => !isGoalCompleted(goal));
  const completed = goals.filter(isGoalCompleted);
  const shown = completedOnly ? completed : active;
  const average = useMemo(() => goals.length ? Math.round(goals.reduce((sum, goal) => sum + progressOf(goal), 0) / goals.length) : 0, [goals]);

  return <>
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-bold text-[#43815e]">{completedOnly ? "Your history" : "Overview"}</p><h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">{completedOnly ? "Completed goals" : "Ready to make progress?"}</h1><p className="mt-2 text-sm text-[#6f7872]">{completedOnly ? "Every achievement tells the story of your growth." : "Small checkpoints build great achievements."}</p></div>
      {!completedOnly && <button onClick={() => setCreating(true)} className="btn btn-primary w-full sm:w-auto"><Plus size={18}/>New goal</button>}
    </header>
    {!completedOnly && <section aria-label="Goal statistics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={<Target/>} label="All goals" value={goals.length}/><Stat icon={<Clock3/>} label="In progress" value={active.length}/><Stat icon={<CheckCircle2/>} label="Completed" value={completed.length}/><Stat icon={<TrendingUp/>} label="Average progress" value={`${average}%`}/></section>}
    <section className="mt-9">
      <div className="mb-4 flex items-center gap-2"><Clock3 size={19} className="shrink-0 text-[#3b7955]"/><h2 className="text-xl font-black">{completedOnly ? "Achievements" : "In progress"}</h2><span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-gray-500">{shown.length}</span></div>
      {loading ? <div className="card animate-pulse p-8 text-center text-sm text-gray-500 sm:p-10">Loading goals...</div>
        : error ? <div className="card p-8 text-center sm:p-10"><p className="text-sm font-semibold text-red-700">{error}</p><button onClick={() => void load()} className="btn btn-soft mt-4">Try again</button></div>
        : shown.length ? <div className="grid items-start gap-4 lg:grid-cols-2">{shown.map((goal) => <GoalCard key={goal.id} goal={goal} refresh={load} showUpdatedAt={completedOnly}/>)}</div>
        : <div className="card grid place-items-center p-8 text-center sm:p-12"><div className="grid size-14 place-items-center rounded-2xl bg-[#ebf1e7] text-[#3e7b57]"><Target/></div><h3 className="mt-4 font-black">{completedOnly ? "No completed goals yet" : "You don't have any goals yet"}</h3><p className="mt-1 max-w-sm text-sm text-gray-500">{completedOnly ? "Complete every checkpoint in a goal and it will appear here." : "Create your first goal to get started."}</p>{!completedOnly && <button onClick={() => setCreating(true)} className="btn btn-primary mt-5"><Plus size={17}/>Create first goal</button>}</div>}
    </section>
    {!completedOnly && <div className="mt-8 flex justify-center"><Link href="/metas-anteriores" className="btn btn-soft">View previous goals</Link></div>}
    {message && <div role="status" aria-live="polite" className="fixed bottom-5 left-5 right-5 z-50 rounded-xl bg-[#173e2a] px-5 py-3 text-center text-sm font-bold text-white shadow-xl sm:left-auto">{message}</div>}
    {creating && <GoalForm onClose={() => setCreating(false)} onDone={() => { setCreating(false); void load(); setMessage("Goal created successfully!"); window.setTimeout(() => setMessage(""), 3000); }}/>} 
  </>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="card flex min-w-0 items-center gap-4 p-5"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f1e8] text-[#34734e]">{icon}</span><div className="min-w-0"><p className="text-2xl font-black">{value}</p><p className="text-xs font-semibold text-[#778079]">{label}</p></div></div>;
}
