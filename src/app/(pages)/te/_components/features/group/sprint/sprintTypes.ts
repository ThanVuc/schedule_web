export type SprintStatus = "Draft" | "Active" | "Completed" | "Cancelled";

export interface SprintApiItem {
  id?: string;
  sprint_id?: string;
  name?: string;
  title?: string;
  goal?: string;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  status?: string | number | { name?: string; value?: string; id?: string | number } | null;
  progress?: number;
}

export type SprintListMetadata =
  | SprintApiItem[]
  | {
    items?: SprintApiItem[];
    sprints?: SprintApiItem[];
    data?: SprintApiItem[] | { items?: SprintApiItem[] };
    result?: { items?: SprintApiItem[] };
  };

export interface Sprint {
  id: string;
  altSprintId?: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  progress: number;
}

export interface SprintFormData {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
}

export type SprintApiErrorBody = {
  detail?: string;
  errorCode?: string;
};

export type SprintToastErrorContext =
  | "deleteSprint"
  | "activateSprint"
  | "completeSprint"
  | "cancelSprint"
  | "createEditSprint"
  | "generateSprintAi";

export type GenerateSprintAiTab = "text" | "upload";

export interface GenerateSprintWithAIFormData {
  tab: GenerateSprintAiTab;
  planningContext: string;
}

export interface GenerateSprintWithAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess?: () => void;
}

export type CreateEditSprintMode = "create" | "edit";

export interface CreateEditSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SprintFormData;
  onSuccess?: () => void;
  mode: CreateEditSprintMode;
  groupId: string;
  editTarget?: Sprint | null;
}

export interface SprintStatusMutationDialogProps {
  target: Sprint | null;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess?: () => void;
}

