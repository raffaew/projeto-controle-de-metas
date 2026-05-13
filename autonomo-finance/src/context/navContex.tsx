"use client"

import { createContext, useContext, useState} from "react";
import type { NavPage } from "@/types/index";

interface NavContextProps {
  selected: NavPage
  setSelected: (page: NavPage) => void
}

const NavContext = createContext<NavContextProps | null>(null)

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<NavPage>('dashboard')

  return (
    <NavContext.Provider value={{ selected, setSelected }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav deve ser usado dentro do NavProvider')
  return ctx
}