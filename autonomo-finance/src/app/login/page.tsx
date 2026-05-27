'use client'

import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-5">
            <i className="ti ti-chart-line text-[28px] text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            AutoFinance
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Controle financeiro para autônomos
          </p>
        </div>


        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">

          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Bem-vindo
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
            Entre com sua conta Google para acessar o painel
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 cursor-pointer dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-all active:scale-[0.98] shadow-sm"
          >
            {/* Ícone SVG do Google */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

       
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          </div>

        
          <div className="space-y-2.5">
            {[
              { icon: 'target', text: 'Defina metas mensais de lucro' },
              { icon: 'trending-up', text: 'Acompanhe seus ganhos diários' },
              { icon: 'chart-bar', text: 'Visualize seu progresso em tempo real' },
            ].map(item => (
              <div key={item.icon} className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <i className={`ti ti-${item.icon} text-[13px] text-emerald-500`} aria-hidden />
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
