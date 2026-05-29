"use client";

import { useMeta } from "@/hooks/useGoal";
import { SummaryCards } from "@/components/summaryCards/SummaryCards";
import { FormRelease } from "@/components/formRelese/FormReleases";
import { ListRelease } from "@/components/formRelese/ListReleases";
import { Sidebar } from "@/components/siderBar/Sidebar";
import { LABELS_TYPE, MONTHS } from "@/lib/utils";
import { useNav } from "@/context/navContex";
import { Releases } from "@/components/releases/Releases";
import { Goal } from "@/components/goal/Goal";
import { CreateGoal } from "@/components/createGoal/CreateGoal";
import { ModalSettings } from "@/components/modalSettings/modalSettings";
import type { MetaCard } from "@/types";
import { useState } from "react";

interface DashboardClientProps {
  metasIniciais: MetaCard[];
}

export function DashboardClient({ metasIniciais }: DashboardClientProps) {
  const { selected, setSelected } = useNav();
  const [openModal, setOpenModal] = useState(false);

  const {
    goal,
    metaCard,
    handleSelectRelease,
    releases,
    handleCreateGoal,
    handleAddRelease,
    handleDeleteRelease,
    reset,
    loading,
    handleDeleteGoal,
  } = useMeta(metasIniciais);

  return (
    <div className=" bg-zinc-50 dark:bg-zinc-950">
      
      <Sidebar setOpenModal={setOpenModal} />
      <ModalSettings openModal={openModal} setOpenModal={setOpenModal} />

      <main className="md:ml-60 min-h-screen p-6 flex flex-col">
        <div className="mt-6 flex-1 w-full max-w-7xl mx-auto space-y-6">
          {selected === "metas" && (
            <>
              {metaCard.length === 0 ? (
                <CreateGoal onSubmit={handleCreateGoal} />
              ) : (
                <Goal
                  metas={metaCard}
                  loading={loading}
                  onViewGoal={(metaSelecionada) => {
                    handleSelectRelease(metaSelecionada);
                    setSelected("dashboard");
                  }}
                  onDeleteGoal={handleDeleteGoal}
                  onNewGoal={() => {
                    setSelected("dashboard");
                    reset();
                  }}
                />
              )}
            </>
          )}

          {selected === "dashboard" && (
            <>
              {!goal ? (
                <CreateGoal onSubmit={handleCreateGoal} />
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                        {LABELS_TYPE[goal.tipoTrabalho]} ·{" "}
                        {MONTHS[goal.mes - 1]} {goal.ano}
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
                        onClick={reset}
                        className="cursor-pointer flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2"
                      >
                        <i className="ti ti-refresh text-[14px]" aria-hidden />
                        Nova meta
                      </button>
                    </div>
                  </div>

                  {goal.resumo && <SummaryCards resumo={goal.resumo} />}

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 ">
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                      <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                        <i
                          className="ti ti-calendar-plus text-[16px] text-emerald-500"
                          aria-hidden
                        />
                        Registrar hoje
                      </h2>

                      <FormRelease
                        metaId={goal.id}
                        metaDiaria={goal.metaDiaria}
                        onSubmit={handleAddRelease}
                        diasTrabalhados={releases.length}
                        diasTotal={goal.diasRestantes ?? goal.diasTrabalhados}
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

                        {releases.length > 0 && (
                          <span className="text-xs text-zinc-400">
                            {releases.filter((l) => l.bateuMeta).length} de{" "}
                            {releases.length} acima da meta
                          </span>
                        )}
                      </div>

                      <ListRelease
                        releases={releases}
                        dailyGoal={goal.metaDiaria}
                        onDelete={handleDeleteRelease}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {selected === "lancamentos" && <Releases />}
        </div>
      </main>
    </div>
  );
}
