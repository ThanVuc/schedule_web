import { ENUM_GROUP_ROLE, ENUM_SPRINT_STATUS, ENUM_USER_STATUS, ENUM_WORK_PRIORITY, ENUM_WORK_STATUS } from "@/constant/enumMap";

export const useEnumMap = (key?: number, type?: "USER_STATUS" | "GROUP_ROLE" | "SPRINT_STATUS" | "WORK_STATUS" | "WORK_PRIORITY") => {
  if (!key || !type) return null;

  switch (type) {
    case "USER_STATUS":
      return ENUM_USER_STATUS[key];
    case "GROUP_ROLE":
      return ENUM_GROUP_ROLE[key];
    case "SPRINT_STATUS":
      return ENUM_SPRINT_STATUS[key];
    case "WORK_STATUS":
      return ENUM_WORK_STATUS[key];
    case "WORK_PRIORITY":
      return ENUM_WORK_PRIORITY[key];
    default:
      return null;
  }
};
