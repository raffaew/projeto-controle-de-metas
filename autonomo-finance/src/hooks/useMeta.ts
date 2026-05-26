// src/hooks/useMeta.ts
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
  // inicializa com dados do servidor — sem delay, sem flash
  const [meta, setMeta] = useState<MetaCard | null>(null);
  const [metaCard, setMetaCard] = useState<MetaCard[]>(metasIniciais);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  // rebusca quando o token muda (primeira vez que a sessão carrega)
  // mas só se não tiver dados iniciais do servidor
  useEffect(() => {
    if (session?.backendToken && metasIniciais.length === 0) {
      getGoals(session.backendToken);
    }
  }, [session?.backendToken]);

  console.log(meta)
  // ── Buscar metas ──────────────────────────────────────────────────────────

  const getGoals = useCallback(async (token: string) => {
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
  }, [getUserGoals]);

  // ── Criar meta ────────────────────────────────────────────────────────────
  const definirMeta = useCallback(
    async (novaMeta: Meta) => {
      try {
        setLoading(true);
        const goal = await createGoal(novaMeta, session?.backendToken || "");
        setMeta(goal);
        setLancamentos([]);

        // atualiza a lista de cards
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

  // ── Selecionar meta para o dashboard ─────────────────────────────────────
  const selecionarMeta = useCallback((metaSelecionada: MetaCard) => {
    setMeta(metaSelecionada);
    setLancamentos(metaSelecionada?.lancamentos || [])
  }, []);

  // ── Deletar meta ──────────────────────────────────────────────────────────
  const deletarMeta = useCallback(
    async (metaId: string) => {
      try {
        setLoading(true);
        await deleteGoal(metaId, session?.backendToken || "");
        setMetaCard((prev) => prev.filter((m) => m.id !== metaId));

        // se a meta ativa foi deletada, limpa o dashboard
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

  // ── Adicionar lançamento ──────────────────────────────────────────────────
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

        // rebusca para atualizar o resumo
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


  // ── Remover lançamento ────────────────────────────────────────────────────
  const removerLancamento = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await deleteRelease(id, session?.backendToken || "");
        setLancamentos((prev) => prev.filter((l) => l.id !== id));

        // rebusca para atualizar o resumo
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

  // ── Resetar ───────────────────────────────────────────────────────────────
  const resetar = useCallback(() => {
    setMeta(null);
    setMetaCard([]);
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
  };
}
