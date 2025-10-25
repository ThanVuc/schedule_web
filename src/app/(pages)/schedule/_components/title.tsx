import { ReactNode } from "react"

export const Title = ({children}: {children: ReactNode}) => {
    return (
        <p className="italic text-white font-bold text-xl">{children}</p>
    )
}
