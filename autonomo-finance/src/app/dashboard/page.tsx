"use client";
import { useSession } from "next-auth/react";
import { useMeta } from "@/hooks/useMeta";
import { ResumoCards } from "@/components/resumoCards/ResumoCards";
import { FormMeta } from "@/components/formMetas/FormMeta";
import { FormLancamento } from "@/components/formLancamentos/FormLancamento";
import { Listalancamentos } from "@/components/formLancamentos/ListaLancamentos";
import { Sidebar } from "@/components/siderBar/Sidebar";
import { LABELS_TIPO, MESES } from "@/lib/utils";
import { useNav } from "@/context/navContex";
import { Lancamentos } from "@/components/lancamentos/Lancamentos";
import { Metas } from "@/components/metas/Metas";

import { useEffect } from "react";

export default function DashboardPage() {
  const { selected } = useNav();
  const { data: session } = useSession();

   console.log('session:', session)
  // console.log('backendToken:', session?.backendToken)
  // console.log('backendId:', session?.backendId)

  const {
    meta,
    resumo,
    lancamentos,
    definirMeta,
    adicionarLancamento,
    removerLancamento,
    resetar,
  } = useMeta();
  // ── Sem meta configurada: mostrar formulário de setup ───────────────────────
  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 mb-4">
              <i
                className="ti ti-target text-[24px] text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Configure sua meta
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Defina quanto quer ganhar e em quantos dias para começar o
              acompanhamento
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <FormMeta onSubmit={definirMeta} />
          </div>
        </div>
      </div>
    );
  }

  // ── dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="pl-60 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />

      {selected === "metas" && <Metas />}
      {selected === "lancamentos" && <Lancamentos />}

      {selected === "dashboard" && (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                {LABELS_TIPO[meta.tipoTrabalho]} · {MESES[meta.mes - 1]}
                {meta.ano}
              </p>
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Dashboard
              </h1>
            </div>
            <button
              onClick={resetar}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 cursor-pointer"
            >
              <i className="ti ti-refresh text-[14px]" aria-hidden />
              Nova meta
            </button>
          </div>

          {/* Resumo + progresso */}
          {resumo && <ResumoCards resumo={resumo} />}

          {/* Grid: formulário + histórico */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Formulário de lançamento */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                <i
                  className="ti ti-calendar-plus text-[16px] text-emerald-500"
                  aria-hidden
                />
                Registrar hoje
              </h2>
              {meta && (
                <FormLancamento
                  metaId={meta.id}
                  metaDiaria={meta.metaDiaria}
                  onSubmit={adicionarLancamento}
                  diasTrabalhados={lancamentos.length}
                  diasTotal={meta.diasTrabalho}
                />
              )}
            </div>

            {/* Histórico de dias */}
            <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <i
                    className="ti ti-list text-[16px] text-zinc-400"
                    aria-hidden
                  />
                  Histórico de dias
                </h2>
                {lancamentos.length > 0 && (
                  <span className="text-xs text-zinc-400">
                    {lancamentos.filter((l) => l.bateuMeta).length} de{" "}
                    {lancamentos.length} acima da meta
                  </span>
                )}
              </div>
              <Listalancamentos
                lancamentos={lancamentos}
                metaDiaria={meta.metaDiaria}
                onRemover={removerLancamento}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}