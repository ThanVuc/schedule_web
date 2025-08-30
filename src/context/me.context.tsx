import { MeModel } from "@/models/me";
import { createContext, useContext } from "react";

type MeContextType = {
  me: MeModel | null;
  refetchMe: () => void;
}

const MeContext = createContext<MeContextType | null>(null);

export function MeProvider({ children, me, refetchMe }: { children: React.ReactNode; me: MeModel | null, refetchMe: () => void }) {
  return <MeContext.Provider value={{ me, refetchMe  }}>{children}</MeContext.Provider>;
}

export function useMe() {
    if (MeContext === null) {
        throw new Error("useMe must be used within a MeProvider");
    }

    return useContext(MeContext);
}
