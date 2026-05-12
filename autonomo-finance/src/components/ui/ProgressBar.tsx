import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number  // 0–100
  label?: string
  showPercent?: boolean
  className?: string
}

function getColor(v: number) {
  if (v >= 100) return 'bg-emerald-500'
  if (v >= 60)  return 'bg-emerald-400'
  if (v >= 30)  return 'bg-amber-400'
  return 'bg-red-400'
}

export function ProgressBar({ value, label, showPercent = true, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-medium">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getColor(clamped))}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
