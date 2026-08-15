export function GoalProgress({ progress, label = "Progress" }: { progress: number; label?: string }) {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));
  return <div>
    <div className="mb-2 flex justify-between text-xs font-bold"><span>{label}</span><span className="text-[#27704b]">{safeProgress}%</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-[#e8ece6]" role="progressbar" aria-label="Goal progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeProgress}>
      <div className="h-full rounded-full bg-[#4c9a68] transition-[width] duration-300" style={{ width: `${safeProgress}%` }}/>
    </div>
  </div>;
}
