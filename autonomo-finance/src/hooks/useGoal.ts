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

export function useMeta(initialGoals: MetaCard[] = []) {
  const [goal, setGoal] = useState<MetaCard | null>(initialGoals[0] ?? null);
  const [metaCard, setGoalCard] = useState<MetaCard[]>(initialGoals);
  const [releases, setRelease] = useState<Lancamento[]>(
    initialGoals[0]?.lancamentos || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken && initialGoals.length === 0) {
      handleGetUserGoal(session.backendToken);
    }
  }, [session?.backendToken]);


  const handleGetUserGoal = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        const goals: MetaCard[] = await getUserGoals(token);
        setGoalCard(goals);
        return goals;
      } catch (error) {
        console.error("erro ao buscar metas:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleCreateGoal = useCallback(
    async (novaMeta: Meta) => {
      try {
        setLoading(true);
        const goal = await createGoal(novaMeta, session?.backendToken || "");
        setGoal(goal);
        setRelease([]);
        await handleGetUserGoal(session?.backendToken!);
      } catch (error) {
        setError(error as string);
        console.error("erro definirMeta:", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, handleGetUserGoal],
  );

  const handleSelectRelease = useCallback((metaSelecionada: MetaCard) => {
    setGoal(metaSelecionada);
    setRelease(metaSelecionada?.lancamentos || []);
  }, []);

  const handleDeleteGoal = useCallback(
    async (metaId: string) => {
      try {
        setLoading(true);
        await deleteGoal(metaId, session?.backendToken || "");
        setGoalCard((prev) => prev.filter((m) => m.id !== metaId));

        if (goal?.id === metaId) {
          setGoal(null);
          setRelease([]);
        }
      } catch (error) {
        setError("Erro ao deletar meta");
        console.error("erro handleDeleteGoal:", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, goal?.id],
  );

  const handleAddRelease = useCallback(
    async (form: LancamentoForm) => {
      if (!goal) return;
      try {
        setLoading(true);
        const novo: Lancamento = {
          valorBruto: form.valorBruto,
          gastos: form.gastos.map((g) => ({ ...g })),
        };

        const release = await createRelease(
          novo,
          goal.id,
          session?.backendToken!,
        );
        setRelease((prev) => [...prev, release]);


        const goalsAtualizados = await handleGetUserGoal(session?.backendToken!);
        if (goalsAtualizados) {
          const metaAtualizada = goalsAtualizados.find((m) => m.id === goal.id);
          if (metaAtualizada) setGoal(metaAtualizada);
        }
      } catch (error) {
        console.error("erro handleAddRelease:", error);
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, goal?.id],
  );

  const handleDeleteRelease = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await deleteRelease(id, session?.backendToken || "");
        setRelease((prev) => prev.filter((l) => l.id !== id));

  
        const goalsAtualizados = await handleGetUserGoal(session?.backendToken!);
        if (goalsAtualizados) {
          const metaAtualizada = goalsAtualizados.find(
            (m) => m.id === goal?.id,
          );
          if (metaAtualizada) setGoal(metaAtualizada);
        }
      } catch (error) {
        console.error("erro handleDeleteRelease:", error);
      } finally {
        setLoading(false);
      }
    },
    [goal?.id, session?.backendToken, handleGetUserGoal],
  );

  const reset = useCallback(() => {
    setGoal(null);
    setRelease([]);
    setError(null);
  }, []);

  return {
    goal,
    releases,
    metaCard,
    loading,
    error,
    handleCreateGoal,
    handleAddRelease,
    handleDeleteRelease,
    reset,
    handleSelectRelease,
    handleDeleteGoal,
    handleGetUserGoal,
  };
}
