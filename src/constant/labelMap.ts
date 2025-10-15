import { HomeIcon } from '@/components/icon';
import type { FC, SVGProps } from 'react';

export const LABEL_ICON_MAP: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  // Work Type
  "REPEATED": HomeIcon, 
  "DAILY": HomeIcon,
  "GROUP": HomeIcon,

  // Status
  "PENDING": HomeIcon,
  "IN_PROGRESS": HomeIcon,
  "COMPLETED": HomeIcon,
  "OVER_DUE": HomeIcon,
  "CANCELLED": HomeIcon,
  
  // Difficulty
  "EASY": HomeIcon,
  "MEDIUM": HomeIcon,
  "HARD": HomeIcon,
  
  // Priority
  "IMPORTANT_URGENT": HomeIcon,
  "IMPORTANT_NOT_URGENT": HomeIcon,
  "NOT_IMPORTANT_URGENT": HomeIcon,
  "NOT_IMPORTANT_NOT_URGENT": HomeIcon,

  // Category
  "WORK": HomeIcon,
  "PERSONAL": HomeIcon,
  "STUDY": HomeIcon,
  "FINANCE": HomeIcon,
  "HEALTH": HomeIcon,
  "SOCIAL": HomeIcon,
  "TRAVEL": HomeIcon,

  // Draft
  "DRAFT": HomeIcon,
};
