import { GroupRole } from "./groupRole";
import { SprintStatus } from "./sprintStatus";
import { UserStatus } from "./userStatus";
import { WorkPriority } from "./workPriority";
import { WorkStatus } from "./workStatus";

export type EnumMapType = "USER_STATUS" | "GROUP_ROLE" | "SPRINT_STATUS" | "WORK_STATUS" | "WORK_PRIORITY";

export const enumDisplayMap: Record<EnumMapType, Record<number, string>> = {
  USER_STATUS: {
    [UserStatus.UNSPECIFIED]: "Unspecified",
    [UserStatus.ACTIVE]: "Active",
    [UserStatus.INACTIVE]: "Inactive",
  },
  GROUP_ROLE: {
    [GroupRole.UNSPECIFIED]: "Unspecified",
    [GroupRole.OWNER]: "Owner",
    [GroupRole.MANAGER]: "Manager",
    [GroupRole.MEMBER]: "Member",
    [GroupRole.VIEWER]: "Viewer",
  },
  SPRINT_STATUS: {
    [SprintStatus.UNSPECIFIED]: "Unspecified",
    [SprintStatus.DRAFT]: "Draft",
    [SprintStatus.ACTIVE]: "Active",
    [SprintStatus.COMPLETED]: "Completed",
    [SprintStatus.CANCELLED]: "Cancelled",
  },
  WORK_STATUS: {
    [WorkStatus.UNSPECIFIED]: "Unspecified",
    [WorkStatus.TODO]: "To do",
    [WorkStatus.IN_PROGRESS]: "In Progress",
    [WorkStatus.IN_REVIEW]: "In Review",
    [WorkStatus.DONE]: "Done",
  },
  WORK_PRIORITY: {
    [WorkPriority.UNSPECIFIED]: "Unspecified",
    [WorkPriority.LOW]: "Low",
    [WorkPriority.MEDIUM]: "Medium",
    [WorkPriority.HIGH]: "High",
  },
};
