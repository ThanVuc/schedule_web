export type SprintStatus = "Draft" | "Active" | "Completed" | "Cancelled";

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  progress: number;
}

export interface SprintFormData {
  name: string;
  startDate: string;
  endDate: string;
}

