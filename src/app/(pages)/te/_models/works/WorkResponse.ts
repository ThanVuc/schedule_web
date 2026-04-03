import { ChecklistItemResponse } from "./CheckList";
import { CommentResponse } from "./Comment";

export interface UserResponse {
  id: string;
  email: string;
  avatar: string;
}
export interface WorkResponse {
  id: string;
  name: string; 
  status: number;
  description: string;
  assignee: UserResponse;
  story_point: number;
  due_date?: string;
  created_at?: string;
  updated_at?: string; 
  version: number;
}
export interface WorkRequest {
  name: string; 
  description: string;
  status: number;
  sprint_id?: string;
  is_unset_sprint?: boolean;
  is_unassigned?: boolean;
  priority?: number;
  assignee_id?: string;
  assignee: UserResponse;
  story_point: number;
  due_date?: string;
  created_at?: string;
  updated_at?: string; 
  version?: number;
}
export interface WorkColumn {
  id: string;
  name: string;
  tasks: WorkResponse[];
}
export interface WorkDetailResponse {
  id: string;
  name: string; 
  status: number;
  description: string;
  assignee: UserResponse;
  story_point: number;
  priority: number;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  sprint?: sprintResponse;
  check_list: itemsChecklistResponse;
  comments: itemsCommentResponse;
  version: number;
}
export interface sprintResponse {
  id: string;
  name: string;
}
export interface itemsChecklistResponse {
  items: ChecklistItemResponse[];
}
export interface itemsCommentResponse {
  items: CommentResponse[];
}
export interface ListSimpleSprintResponse {
  id: string;
  name: string;
  status: number;
}
export interface ListSimpleUserResponse {
  id: string;
  email: string;
  avatar_url: string;
}
export interface WorkCreateWorkRequest {
  name: string;
  description: string;
  sprint_id?: string;
}
export interface WorkUpdateWorkMovingRequest {
  status?: number;
  version: number;
}