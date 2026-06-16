"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Meta, LancamentoForm, MetaCard } from "@/types";
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
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.backendToken ?? "";

  const [goal, setGoal] = useState<MetaCard | null>(initialGoals[0] ?? null);

  const { data: MetaCard = initialGoals, isLoading: loadingGoals } = useQuery({
    queryKey: ["metas", token],
    queryFn: () => getUserGoals(token),
    enabled: !!token,
    initialData: initialGoals.length > 0 ? initialGoals : undefined,
  });

  const { mutate: handleCreateGoal, isPending: loadingCreateGoal } =
    useMutation({
      mutationFn: (novaMeta: Meta) => createGoal(novaMeta, token),
      onSuccess: (res) => {
        setGoal(res);
        // invalida o cache → React Query rebusca getUserGoals automaticamente
        queryClient.invalidateQueries({ queryKey: ["metas"] });
      },
      onError: (error: Error) =>
        console.error("erro createGoal:", error.message),
    });

  const { mutate: handleDeleteGoal, isPending: loadingDeleteGoal } =
    useMutation({
      mutationFn: (metaId: string) => deleteGoal(metaId, token),
      onSuccess: (_, res) => {
        if (goal?.id === res) {
          setGoal(null);
        }
        queryClient.invalidateQueries({ queryKey: ["metas"] });
      },
      onError: (error) => console.error("erro ao deletar meta:", error),
    });

  const { mutate: handleAddRelease, isPending: loadingAddRelease } =
    useMutation({
      mutationFn: (form: LancamentoForm) =>
        createRelease(
          { valorBruto: form.valorBruto, gastos: form.gastos },
          goal!.id,
          token,
        ),
      onSuccess: (res) => {
        setGoal(res.goal);
        queryClient.invalidateQueries({ queryKey: ["metas"] });
      },
      onError: (error: Error) =>
        console.error("erro ao adicionar lançamento:", error.message),
    });

  const { mutate: handleDeleteRelease, isPending: loadingDeleteRelease } =
    useMutation({
      mutationFn: (id: string) => deleteRelease(id, token),
      onSuccess: (res) => {
        setGoal(res.goal);
        queryClient.invalidateQueries({ queryKey: ["metas"] });
      },
      onError: (error: Error) => {
        console.error("erro deleteRelease:", error.message);
      },
    });

  const { mutate: handleDeleteUser } = useMutation({
    mutationFn: (id: string) => deleteUser(id, token),
    onError: (error: Error) => console.error("erro deleteUser:", error.message),
  });

  const handleSelectRelease = (metaSelecionada: MetaCard) => {
    setGoal(metaSelecionada);
  };

  const reset = () => {
    setGoal(null);
  };

  return {
    goal,
    releases: goal?.lancamentos || [],
    metaCard: MetaCard ?? [],
    loading: {
      goal: loadingGoals || loadingCreateGoal,
      releases: loadingAddRelease || loadingDeleteRelease,
    },
    handleCreateGoal,
    handleAddRelease,
    handleDeleteRelease,
    reset,
    handleSelectRelease,
    handleDeleteGoal,
    handleGetUserGoal: () =>
      queryClient.invalidateQueries({ queryKey: ["metas"] }),
    handleDeleteUser,
  };
}
