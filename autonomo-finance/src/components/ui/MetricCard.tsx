import { cn } from '@/lib/cn'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
  className?: string
}

const variantStyles = {
  default: 'text-zinc-900 dark:text-zinc-100',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger:  'text-red-500 dark:text-red-400',
  info:    'text-blue-600 dark:text-blue-400',
}

export function MetricCard({ label, value, sub, variant = 'default', icon, className }: MetricCardProps) {
  return (
    <div className={cn(
      'bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 flex flex-col gap-1',
      className
    )}>
      <div className="flex items-center gap-2">
        {icon && <i className={`ti ti-${icon} text-[15px] text-zinc-400`} aria-hidden />}
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
      <span className={cn('text-2xl font-semibold tracking-tight', variantStyles[variant])}>
        {value}
      </span>
      {sub && <span className="text-xs text-zinc-400">{sub}</span>}
    </div>
  )
}
