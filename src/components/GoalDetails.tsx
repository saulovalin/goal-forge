"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { GoalWithCheckpoints } from "@/lib/goals";
import { GoalCard } from "@/components/GoalCard";

export function GoalDetails({ id }: { id: string }) {
  const router = useRouter();
  const [goal, setGoal] = useState<GoalWithCheckpoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const response = await fetch(`/api/goals/${id}`, { cache: "no-store" });
      if (response.status === 404) { setNotFound(true); setGoal(null); }
      else if (response.ok) { setGoal(await response.json()); setNotFound(false); }
      else throw new Error();
    } catch { setError("We couldn't load this goal."); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);

  return <div className="mx-auto min-w-0 max-w-3xl">
    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#3b7553] hover:text-[#214b35]"><ArrowLeft size={17}/>Back to dashboard</Link>
    <p className="text-sm font-bold text-[#43815e]">Goal details</p>
    <h1 className="mb-7 mt-1 text-3xl font-black tracking-tight sm:text-4xl">Track every step</h1>
    {loading && <div className="card animate-pulse p-8 text-center text-sm text-gray-500 sm:p-10">Loading goal...</div>}
    {error && <div className="card p-8 text-center sm:p-10"><p className="text-sm font-semibold text-red-700">{error}</p><button onClick={() => void load()} className="btn btn-soft mt-4">Try again</button></div>}
    {notFound && <div className="card p-8 text-center sm:p-10"><h2 className="text-xl font-black">Goal not found</h2><p className="mt-2 text-sm text-gray-500">It may have been deleted.</p></div>}
    {goal && !error && <GoalCard goal={goal} refresh={load} onDeleted={() => router.push("/")}/>} 
  </div>;
}
