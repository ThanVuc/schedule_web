import type { Sprint } from "./sprintTypes";

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: "1",
    name: "Sprint 1 - Design System",
    startDate: "12/2/2024",
    endDate: "26/2/2024",
    status: "Active",
    progress: 66,
  },
  {
    id: "2",
    name: "Sprint 2 - User Dashboard",
    startDate: "26/2/2024",
    endDate: "11/3/2024",
    status: "Draft",
    progress: 0,
  },
  {
    id: "0",
    name: "Sprint 0 - Foundation",
    startDate: "29/1/2024",
    endDate: "12/2/2024",
    status: "Completed",
    progress: 100,
  },
  {
    id: "3",
    name: "Sprint 3 - Reporting Views",
    startDate: "12/2/2024",
    endDate: "25/2/2024",
    status: "Draft",
    progress: 0,
  },
];

