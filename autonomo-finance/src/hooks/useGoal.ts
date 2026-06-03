"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  Meta,
  Lancamento,
  LancamentoForm,
  MetaCard,
  DeleteReleaseResponse,
  CreateReleaseResponse,
} from "@/types";
import {
  createGoal,
  createRelease,
  getUserGoals,
  deleteGoal,
  deleteRelease,
  deleteUser,
} from "@/lib/api";
import { useSession } from "next-auth/react";

export function useMeta(initialGoals: MetaCard[] = []) {
  const [goal, setGoal] = useState<MetaCard | null>(initialGoals[0] ?? null);
  const [metaCard, setGoalCard] = useState<MetaCard[]>(initialGoals);
  const [releases, setRelease] = useState<Lancamento[]>(
    initialGoals[0]?.lancamentos || [],
  );
  const [loading, setLoading] = useState({
    goal: false,
    releases: false,
  });
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.backendToken && initialGoals.length === 0) {
      handleGetUserGoal(session.backendToken);
    }
  }, [session?.backendToken]);

  const handleGetUserGoal = useCallback(async (token: string) => {
    try {
      setLoading((prev) => ({ ...prev, goal: true }));
      const res: MetaCard[] = await getUserGoals(token);
      setGoalCard(res);
    } catch (error) {
      console.error("erro ao buscar metas:", error);
    } finally {
      setLoading((prev) => ({ ...prev, goal: false }));
    }
  }, []);

  const handleCreateGoal = useCallback(
    async (novaMeta: Meta) => {
      try {
        setLoading((prev) => ({ ...prev, releases: true }));
        const res: MetaCard = await createGoal(
          novaMeta,
          session?.backendToken || "",
        );
        setGoal(res);
        setRelease([]);
        await handleGetUserGoal(session?.backendToken!);
      } catch (error) {
        setError(error as string);
        console.error("erro definirMeta:", error);
      } finally {
        setLoading((prev) => ({ ...prev, releases: false }));
      }
    },
    [session?.backendToken, handleGetUserGoal],
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUser(id, session?.backendToken || "");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        throw error;
      }
    },
    [session?.backendToken],
  );

  const handleSelectRelease = useCallback((metaSelecionada: MetaCard) => {
    setGoal(metaSelecionada);
    setRelease(metaSelecionada?.lancamentos || []);
  }, []);

  const handleDeleteGoal = useCallback(
    async (metaId: string) => {
      try {
        setLoading((prev) => ({ ...prev, goal: true }));
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
        setLoading((prev) => ({ ...prev, goal: false }));
      }
    },
    [session?.backendToken, goal?.id],
  );

  const handleAddRelease = useCallback(
    async (form: LancamentoForm) => {
      if (!goal) return;
      try {
        setLoading((prev) => ({ ...prev, releases: true }));
        const novo: Lancamento = {
          valorBruto: form.valorBruto,
          gastos: form.gastos.map((g) => ({ ...g })),
        };

        const res: CreateReleaseResponse = await createRelease(
          novo,
          goal.id,
          session?.backendToken!,
        );

        setRelease((prev) => [...prev, res.release]);
        setGoal(res.goal);
        setGoalCard((prev) =>
          prev.map((goal) => (goal.id === res.goal.id ? res.goal : goal)),
        );
      } catch (error) {
        console.error("erro: ", error);
      } finally {
        setLoading((prev) => ({ ...prev, releases: false }));
      }
    },
    [session?.backendToken, goal?.id],
  );

  const handleDeleteRelease = useCallback(
    async (id: string) => {
      try {
        setLoading((prev) => ({ ...prev, releases: true }));
        const res: DeleteReleaseResponse = await deleteRelease(
          id,
          session?.backendToken || "",
        );
        setRelease((prev) => prev.filter((l) => l.id !== id));
        setGoal(res.goal);
        setGoalCard((prev) =>
          prev.map((goal) => (goal.id === res.goal.id ? res.goal : goal)),
        );
      } catch (error) {
        console.error("erro: ", error);
      } finally {
        setLoading((prev) => ({ ...prev, releases: false }));
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
    handleDeleteUser,
  };
}
