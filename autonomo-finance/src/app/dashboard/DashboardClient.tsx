"use client";

import { useMeta } from "@/hooks/useMeta";
import { ResumoCards } from "@/components/resumoCards/ResumoCards";
import { FormLancamento } from "@/components/formLancamentos/FormLancamento";
import { Listalancamentos } from "@/components/formLancamentos/ListaLancamentos";
import { Sidebar } from "@/components/siderBar/Sidebar";
import { LABELS_TIPO, MESES } from "@/lib/utils";
import { useNav } from "@/context/navContex";
import { Lancamentos } from "@/components/lancamentos/Lancamentos";
import { Metas } from "@/components/metas/Metas";
import { CreateMetas } from "@/components/createMetas/CreateMetas";
import type { MetaCard } from "@/types";

interface DashboardClientProps {
  metasIniciais: MetaCard[];
}

export function DashboardClient({ metasIniciais }: DashboardClientProps) {
  const { selected, setSelected } = useNav();

  const {
    meta,
    metaCard,
    selecionarMeta,
    lancamentos,
    definirMeta,
    adicionarLancamento,
    removerLancamento,
    resetar,
    loading,
    deletarMeta,
  } = useMeta(metasIniciais);

  return (
    <div className=" bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />

      <main className="md:ml-60 min-h-screen p-6 flex flex-col">
        <div className="mt-6 flex-1 w-full max-w-7xl mx-auto space-y-6">
          {selected === "metas" && (
            <>
              {metaCard.length === 0 ? (
                <CreateMetas onSubmit={definirMeta} />
              ) : (
                <Metas
                  metas={metaCard}
                  loading={loading}
                  onVerMeta={(metaSelecionada) => {
                    selecionarMeta(metaSelecionada);
                    setSelected("dashboard");
                  }}
                  onDeletarMeta={deletarMeta}
                  onNovaMeta={() => {
                    setSelected("dashboard");
                    resetar();
                  }}
                />
              )}
            </>
          )}

          {selected === "dashboard" && (
            <>
              {!meta ? (
                <CreateMetas onSubmit={definirMeta} />
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                        {LABELS_TIPO[meta.tipoTrabalho]} · {MESES[meta.mes - 1]}{" "}
                        {meta.ano}
                      </p>

                      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Dashboard
                      </h1>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected("metas")}
                        className="cursor-pointer flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2"
                      >
                        <i
                          className="ti ti-arrow-left text-[14px]"
                          aria-hidden
                        />
                        Metas
                      </button>

                      <button
                        onClick={resetar}
                        className="cursor-pointer flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2"
                      >
                        <i className="ti ti-refresh text-[14px]" aria-hidden />
                        Nova meta
                      </button>
                    </div>
                  </div>

                  {meta.resumo && <ResumoCards resumo={meta.resumo} />}

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 ">
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                        <i
                          className="ti ti-calendar-plus text-[16px] text-emerald-500"
                          aria-hidden
                        />
                        Registrar hoje
                      </h2>

                      <FormLancamento
                        metaId={meta.id}
                        metaDiaria={meta.metaDiaria}
                        onSubmit={adicionarLancamento}
                        diasTrabalhados={lancamentos.length}
                        diasTotal={meta.diasRestantes ?? meta.diasTrabalhados}
                      />
                    </div>

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
                </>
              )}
            </>
          )}

          {selected === "lancamentos" && <Lancamentos />}
        </div>
      </main>
    </div>
  );
}
