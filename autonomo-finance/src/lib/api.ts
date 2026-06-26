const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";
import { User, Meta, Lancamento, DeleteReleaseResponse, MetaCard, CreateReleaseResponse } from "@/types/index";

export async function createToken(data: User): Promise<{ token: string, user: User }> {
  const res = await fetch(`${apiURL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("Erro createUser:", res.status, errorBody);
    throw new Error(`Erro ao criar usuário: ${res.status}`);
  }

  return res.json();
}

export async function deleteUser(userId: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${apiURL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data);
  }

  return res.json();
}

export async function createGoal(data: Meta, token: string): Promise<MetaCard> {
  const res = await fetch(`${apiURL}/meta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar meta");
  return res.json();
}

export async function getUserGoals(token: string): Promise<MetaCard[]> {
  const res = await fetch(`${apiURL}/user/metas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar meta");
  return res.json();
}

export async function deleteGoal(metaId: string, token: string): Promise<{ message: string }> {
  const res = await fetch(`${apiURL}/meta/${metaId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao excluir meta");

  return res.json();
}

export async function createRelease(
  data: Lancamento,
  metaId: string,
  token: string,
): Promise<CreateReleaseResponse> {
  const res = await fetch(`${apiURL}/meta/${metaId}/lancamento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar lançamento");

  return res.json();
}

export async function deleteRelease(lancamentoId: string, token: string): Promise<DeleteReleaseResponse> {
  const res = await fetch(`${apiURL}/lancamento/${lancamentoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao excluir lançamento");

  return res.json();
}
export async function getDashboard(metaId: string, token: string): Promise<MetaCard[]> {
  const res = await fetch(`${apiURL}/dashboard/${metaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao buscar metas");
  return res.json();
}


