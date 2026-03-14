
export interface UserResponse {
  id: string;
  name: string;
  avatar: string;
}
export interface WorkResponse {
  id: string;
  name: string; 
  status: 'Todo' | 'In Progress' | 'Review' | 'Completed';
  assignee: UserResponse;
  story_point: number;
  due_date?: string;
  created_at?: string;
  updated_at?: string; 
}
export interface WorkColumn {
  id: string;
  name: string;
  tasks: WorkResponse[];
}