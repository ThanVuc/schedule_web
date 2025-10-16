import { FamilyIcon, FinanceIcon, SpeedLoopIcon ,DocumentIcon , HealthIcon, SocialIcon, TravelIcon, DoneIcon, Circle, Progress, AssignmentIcon, UnHappy, LoopIcon, PlantIcon, BookIcon, WorkIcon } from '@/components/icon';
import type { FC, SVGProps } from 'react';

export const LABEL_ICON_MAP: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  // Work Type
  "REPEATED": LoopIcon,
  "DAILY": FamilyIcon,
  "GROUP": FinanceIcon,

  // Status
  "PENDING": Circle,
  "IN_PROGRESS": Progress,
  "COMPLETED": DoneIcon,
  "OVER_DUE": AssignmentIcon,
  "CANCELLED": UnHappy,
  
  // Difficulty
  "EASY": SpeedLoopIcon,
  "MEDIUM": SpeedLoopIcon,
  "HARD": SpeedLoopIcon,
  
  // Priority
  // "IMPORTANT_URGENT": HomeIcon,
  // "IMPORTANT_NOT_URGENT": HomeIcon,
  // "NOT_IMPORTANT_URGENT": HomeIcon,
  // "NOT_IMPORTANT_NOT_URGENT": HomeIcon,

  // Category
  "WORK": WorkIcon,
  "PERSONAL": PlantIcon,
  "STUDY": BookIcon,
  "FINANCE": FinanceIcon,
  "HEALTH": HealthIcon,
  "SOCIAL": SocialIcon,
  "TRAVEL": TravelIcon,

  // Draft
  "DRAFT": DocumentIcon,
};
