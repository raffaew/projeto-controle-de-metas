"use client";

import { useState, useCallback, useEffect } from "react";
import type { Meta, Lancamento, LancamentoForm, MetaCard } from "@/types";
import {
  createGoal,
  createRelease,
  getUserGoals,
  deleteGoal,
  deleteRelease,
} from "@/lib/api";
import { useSession } from "next-auth/react";

export function useMeta(metasIniciais: MetaCard[] = []) {
  const [meta, setMeta] = useState<MetaCard | null>(metasIniciais[0] ?? null);
  const [metaCard, setMetaCard] = useState<MetaCard[]>(metasIniciais);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(
    metasIniciais[0]?.lancamentos || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken && metasIniciais.length === 0) {
      getGoals(session.backendToken);
    }
  }, [session?.backendToken]);

  
 if(!meta) { 
  console.log("Nao tem");
 } else { 
  console.log("tem");
 }


  const getGoals = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        const goals: MetaCard[] = await getUserGoals(token);
        setMetaCard(goals);
        return goals;
      } catch (error) {
        console.error("erro ao buscar metas:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const definirMeta = useCallback(
    async (novaMeta: Meta) => {
      try {
        setLoading(true);
        const goal = await createGoal(novaMeta, session?.backendToken || "");
        setMeta(goal);
        setLancamentos([]);
        await getGoals(session?.backendToken!);
      } catch (error) {
        setError(error as string);
        console.error("erro definirMeta:", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, getGoals],
  );

  const selecionarMeta = useCallback((metaSelecionada: MetaCard) => {
    setMeta(metaSelecionada);
    setLancamentos(metaSelecionada?.lancamentos || []);
  }, []);

  const deletarMeta = useCallback(
    async (metaId: string) => {
      try {
        setLoading(true);
        await deleteGoal(metaId, session?.backendToken || "");
        setMetaCard((prev) => prev.filter((m) => m.id !== metaId));

        if (meta?.id === metaId) {
          setMeta(null);
          setLancamentos([]);
        }
      } catch (error) {
        setError("Erro ao deletar meta");
        console.error("erro deletarMeta:", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, meta?.id],
  );

  const adicionarLancamento = useCallback(
    async (form: LancamentoForm) => {
      if (!meta) return;
      try {
        setLoading(true);
        const novo: Lancamento = {
          valorBruto: form.valorBruto,
          gastos: form.gastos.map((g) => ({ ...g })),
        };

        const release = await createRelease(
          novo,
          meta.id,
          session?.backendToken!,
        );
        setLancamentos((prev) => [...prev, release]);


        const goalsAtualizados = await getGoals(session?.backendToken!);
        if (goalsAtualizados) {
          const metaAtualizada = goalsAtualizados.find((m) => m.id === meta.id);
          if (metaAtualizada) setMeta(metaAtualizada);
        }
      } catch (error) {
        console.error("erro adicionarLancamento:", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, meta?.id],
  );

  const removerLancamento = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await deleteRelease(id, session?.backendToken || "");
        setLancamentos((prev) => prev.filter((l) => l.id !== id));

  
        const goalsAtualizados = await getGoals(session?.backendToken!);
        if (goalsAtualizados) {
          const metaAtualizada = goalsAtualizados.find(
            (m) => m.id === meta?.id,
          );
          if (metaAtualizada) setMeta(metaAtualizada);
        }
      } catch (error) {
        console.error("erro removerLancamento:", error);
      } finally {
        setLoading(false);
      }
    },
    [meta?.id, session?.backendToken, getGoals],
  );

  const resetar = useCallback(() => {
    setMeta(null);
    setLancamentos([]);
    setError(null);
  }, []);

  return {
    meta,
    lancamentos,
    metaCard,
    loading,
    error,
    definirMeta,
    adicionarLancamento,
    removerLancamento,
    resetar,
    selecionarMeta,
    deletarMeta,
    getGoals,
  };
}
