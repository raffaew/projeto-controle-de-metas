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

  const { data: metaCard = initialGoals, isLoading: loadingGoals } = useQuery({
    queryKey: ["metas", token],
    queryFn: () => getUserGoals(token),
    enabled: !!token,
    initialData: initialGoals.length > 0 ? initialGoals : undefined,
  });

  const createGoalMutation = useMutation({
    mutationFn: (novaMeta: Meta) => createGoal(novaMeta, token),
    onSuccess: (res) => {
      setGoal(res);
      // invalida o cache → React Query rebusca getUserGoals automaticamente
      queryClient.invalidateQueries({ queryKey: ["metas"] });
    },
    onError: (error: Error) => console.error("erro createGoal:", error.message),
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (metaId: string) => deleteGoal(metaId, token),
    onSuccess: (_, metaId) => {
      if (goal?.id === metaId) {
        setGoal(null);
      }
      queryClient.invalidateQueries({ queryKey: ["metas"] });
    },
    onError: (error) => console.error("erro ao deletar meta:", error),
  });

  const addReleaseMutation = useMutation({
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

  const deleteReleaseMutation = useMutation({
    mutationFn: (id: string) => deleteRelease(id, token),
    onSuccess: (res) => {
      setGoal(res.goal);
      queryClient.invalidateQueries({ queryKey: ["metas"] });
    },
    onError: (error: Error) => {
      console.error("erro deleteRelease:", error.message);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id, token),
    onError: (error: Error) => console.error("erro deleteUser:", error.message),
  });

  const handleSelectGoal = (metaSelecionada: MetaCard) => {
    setGoal(metaSelecionada);
  };

  const reset = () => {
    setGoal(null);
  };

  return {
    goal,
    releases: goal?.lancamentos || [],
    metaCard: metaCard ?? [],
    loading: {
      goal: loadingGoals || createGoalMutation.isPending,
      releases: addReleaseMutation.isPending || deleteReleaseMutation.isPending,
    },
    handleCreateGoal: createGoalMutation.mutate,
    handleAddRelease: addReleaseMutation.mutate,
    handleDeleteRelease: deleteReleaseMutation.mutate,
    reset,
    handleSelectGoal,
    handleDeleteGoal: deleteGoalMutation.mutate,
    handleGetUserGoal: () =>
      queryClient.invalidateQueries({ queryKey: ["metas"] }),
    handleDeleteUser: deleteUserMutation.mutate,
  };
}
