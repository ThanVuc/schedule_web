"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type RefetchFn = () => void;

const RefetchContext = createContext<RefetchFn | undefined>(undefined);

interface RefetchProviderProps {
  value?: RefetchFn;
  children: ReactNode;
}

const RefetchProvider = ({ value, children }: RefetchProviderProps) => (
  <RefetchContext.Provider value={value}>{children}</RefetchContext.Provider>
);

const useRefetch = () => useContext(RefetchContext);

export { RefetchProvider, useRefetch };
