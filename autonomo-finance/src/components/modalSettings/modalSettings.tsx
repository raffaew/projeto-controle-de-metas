"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useMeta } from "@/hooks/useGoal";

export function ModalSettings({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}) {
  const { data: session } = useSession();
  const { handleDeleteUser } = useMeta();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState("");

  if (!openModal) return null;

  async function handleDelete() {
    try {
      setLoading(true);
      setError("");
      await handleDeleteUser(session?.userId!);

      setDeleted(true);
      setTimeout(async () => {
        await signOut({ callbackUrl: "/login" });
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Erro ao deletar conta. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {deleted && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <i
                className="ti ti-check text-2xl text-emerald-500 dark:text-emerald-400"
                aria-hidden
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Conta deletada
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Sua conta foi excluída com sucesso. Redirecionando...
              </p>
            </div>

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        )}

        {!deleted && !showDeleteConfirm && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Configurações
                </h1>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Gerencie sua conta
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label="Fechar modal"
              >
                <i className="cursor-pointer ti ti-x text-lg" aria-hidden />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-zinc-900 dark:text-white">
                    {session?.user?.name}
                  </h2>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {session?.user?.email}
                  </p>
                </div>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  aria-label="Deletar conta"
                >
                  <i
                    className="cursor-pointer ti ti-trash text-lg"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </>
        )}

        {!deleted && showDeleteConfirm && (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10">
                <i
                  className="ti ti-alert-triangle text-2xl text-red-500"
                  aria-hidden
                />
              </div>

              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Deletar conta
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Ao deletar sua conta, todas as metas, lançamentos e dados
                associados serão excluídos permanentemente.
              </p>

              <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                Essa ação não poderá ser desfeita.
              </p>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
              <p className="text-sm text-red-600 dark:text-red-300">
                Tem certeza que deseja continuar?
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {error && (
                <p className="flex-1 text-xs text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError("");
                }}
                disabled={loading}
                className="cursor-pointer rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Voltar
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="cursor-pointer flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                Deletar conta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
