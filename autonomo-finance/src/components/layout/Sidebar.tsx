'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/dashboard',    icon: 'layout-dashboard', label: 'Dashboard'     },
  { href: '/metas',        icon: 'target',            label: 'Metas'         },
  { href: '/lancamentos',  icon: 'calendar-plus',     label: 'Lançamentos'   },
  { href: '/relatorios',   icon: 'chart-bar',         label: 'Relatórios'    },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-semibold text-base tracking-tight">
          <span className="text-emerald-500">●</span>{' '}
          AutoFinance
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              <i className={`ti ti-${item.icon} text-[18px]`} aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer usuario */}
      <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">Usuário</p>
            <p className="text-xs text-zinc-400 truncate">Motorista</p>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <i className="ti ti-logout text-[16px]" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  )
}
