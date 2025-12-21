import { formatDate } from "@/app/(pages)/(main)/profile/utils";

export const stringToDate = (v: any): string => {
  if (v == null || v === "") return "";

  const timestamp = Number(v);
  if (!Number.isFinite(timestamp)) {
    return formatDate.numberToString(v);
  }

  return formatDate.numberToString(timestamp);
};



