import { ChecklistItemResponse } from "./CheckList";
import { CommentResponse } from "./Comment";

export interface UserResponse {
  id: string;
  name: string;
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
}
export interface WorkRequest {
  name: string; 
  description: string;
  status: number;
  sprint_id?: string;
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
  sprint_id?: string;
  check_lists: ChecklistItemResponse[];
  comments: CommentResponse[];
  version: number;
}