import {
  EnumMapType,
  GroupRole,
  SprintStatus,
  UserStatus,
  WorkPriority,
  WorkStatus,
  enumDisplayMap,
} from "@/app/(pages)/te/_constants";

const formatEnumLabel = (value?: string | number | null) => {
  if (value === undefined || value === null) return null;

  const text = String(value).toLowerCase();
  return text
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const useEnumMap = (key?: number, type?: EnumMapType) => {
  if (key === undefined || key === null || !type) return null;

  const mappedLabel = enumDisplayMap[type]?.[key];
  if (mappedLabel) return mappedLabel;

  switch (type) {
    case "USER_STATUS":
      return formatEnumLabel(UserStatus[key]);
    case "GROUP_ROLE":
      return formatEnumLabel(GroupRole[key]);
    case "SPRINT_STATUS":
      return formatEnumLabel(SprintStatus[key]);
    case "WORK_STATUS":
      return formatEnumLabel(WorkStatus[key]);
    case "WORK_PRIORITY":
      return formatEnumLabel(WorkPriority[key]);
    default:
      return null;
  }
};
