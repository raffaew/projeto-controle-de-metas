import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'
import type { MetaCard } from '@/types'

async function getMetas(token: string): Promise<MetaCard[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/metas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) return []

    return res.json()
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // redireciona para login se não estiver autenticado
  if (!session) redirect('/login')

  // busca as metas NO SERVIDOR — cliente já recebe renderizado
  const metasIniciais = await getMetas(session.backendToken)

  return (
    <DashboardClient metasIniciais={metasIniciais} />
  )
}
