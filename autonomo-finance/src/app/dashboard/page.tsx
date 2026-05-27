import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { getUserGoals } from "@/lib/api";



export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // redireciona para login se não estiver autenticado
  if (!session) redirect("/login");

  // busca as metas NO SERVIDOR — cliente já recebe renderizado
  const metasIniciais = await getUserGoals(session.backendToken);

  return <DashboardClient metasIniciais={metasIniciais} />;
}
