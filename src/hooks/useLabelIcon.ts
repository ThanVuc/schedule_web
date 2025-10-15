import { LABEL_ICON_MAP } from "@/constant"
import { FC, SVGProps } from "react"

export const useLabelIcon = (key: string): FC<SVGProps<SVGSVGElement>> | null => {
    return LABEL_ICON_MAP[key.toUpperCase()] || null;
}
