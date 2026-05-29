'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useMeta } from '@/hooks/useGoal'

export function ModalSettings({
  openModal,
  setOpenModal,
}: {
  openModal: boolean
  setOpenModal: (value: boolean) => void
}) {
  const { data: session } = useSession()
  const { handleDeleteUser } = useMeta()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading]                     = useState(false)
  const [deleted, setDeleted]                     = useState(false)
  const [error, setError]                         = useState('')

  if (!openModal) return null

  async function handleDelete() {
    try {
      setLoading(true)
      setError('')
      await handleDeleteUser(session?.userId!)

      // só chega aqui se a API retornou sucesso
      setDeleted(true)
      setTimeout(async () => {
        await signOut({ callbackUrl: '/login' })
      }, 2000)

    } catch (error) {
      console.error(error)
      setError('Erro ao deletar conta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

        {/* ── Conta deletada com sucesso ───────────────────────────────── */}
        {deleted && (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <i className="ti ti-check text-2xl text-emerald-400" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Conta deletada
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Sua conta foi excluída com sucesso. Redirecionando...
              </p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* ── Configurações ────────────────────────────────────────────── */}
        {!deleted && !showDeleteConfirm && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Configurações
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Gerencie sua conta
                </p>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Fechar modal"
              >
                <i className="ti ti-x text-lg" aria-hidden />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-white">
                    {session?.user?.name}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {session?.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                  aria-label="Deletar conta"
                >
                  <i className="ti ti-trash text-lg" aria-hidden />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Confirmação de exclusão ──────────────────────────────────── */}
        {!deleted && showDeleteConfirm && (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                <i className="ti ti-alert-triangle text-2xl text-red-500" aria-hidden />
              </div>
              <h1 className="text-xl font-semibold text-white">
                Deletar conta
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Ao deletar sua conta, todas as metas, lançamentos e dados
                associados serão excluídos permanentemente.
              </p>
              <p className="mt-2 text-sm text-red-400">
                Essa ação não poderá ser desfeita.
              </p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-red-300">
                Tem certeza que deseja continuar?
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">

              {/* Mensagem de erro */}
              {error && (
                <p className="text-xs text-red-400 flex-1">{error}</p>
              )}

              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setError('')
                }}
                disabled={loading}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
              >
                Voltar
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {loading && (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}
                {loading ? 'Deletando...' : 'Deletar conta'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
