"use client";

import { createContext, ReactNode, useContext } from "react";

const CsrfContext = createContext<string | null>(null);

export function CsrfProvider({ children, token }: { children: ReactNode; token: string }) {
  return <CsrfContext.Provider value={token}>{children}</CsrfContext.Provider>;
}

export function useCsrfToken() {
  return useContext(CsrfContext);
}
