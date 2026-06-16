"use client";
import { useSession, signOut } from "next-auth/react";
import { useNav } from "@/context/navContex";
import type { NavPage } from "@/types/index";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { useMeta } from "@/hooks/useGoal";

const NAV: { id: NavPage; icon: string; label: string }[] = [
  { id: "dashboard", icon: "layout-dashboard", label: "Dashboard" },
  { id: "metas", icon: "target", label: "Metas" },
  //{ id: "lancamentos", icon: "calendar-plus", label: "Lancamentos" },
  // { id: 'relatorios',  icon: 'chart-bar',         label: 'Relatórios'  },
];

export function Sidebar({
  setOpenModal,
}: {
  setOpenModal: (value: boolean) => void;
}) {
  const { selected, setSelected } = useNav();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { handleGetUserGoal } = useMeta();

  return (
    <>
      {/* Botão hamburguer mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          md:hidden
          fixed
          top-4
          left-4
          z-50
          p-2
        "
      >
        <i className="ti ti-menu-2 text-xl" />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          h-full
          w-60
          border-r
          border-zinc-200
          dark:border-zinc-800
          bg-white
          dark:bg-zinc-950
          flex
          flex-col
          z-50
          transition-transform
          duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-semibold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
            <span className="text-emerald-500">●</span> AutoFinance
          </span>

          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <i className="ti ti-x text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = selected === item.id;

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.id === "metas") {
                    setSelected(item.id as NavPage);
                    setIsOpen(false);
                    handleGetUserGoal();
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                  active
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
                )}
              >
                <i className={`ti ti-${item.icon} text-[18px]`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
          {session?.user ? (
            <div className="flex items-center gap-3 px-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Usuário"}
                  className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                  {session.user.name?.[0] ?? "U"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">
                  {session.user.name?.split(" ")[0]}
                </p>

                <p className="text-xs text-zinc-400 truncate">
                  {session.user.email}
                </p>
              </div>

              <button 
              onClick={() => setOpenModal(true)}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1 shrink-0 cursor-pointer">
                <i className="ti ti-settings text-[16px]" />
              </button>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1 shrink-0 cursor-pointer"
              >
                <i className="ti ti-logout text-[16px]" />
              </button>
            </div>
          ) : (
            <div className="px-2 h-10 flex items-center">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
