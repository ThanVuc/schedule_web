export interface CreateChecklistItemRequest {
    name: string;
}
export interface ChecklistItemResponse {
    id: string;
    name: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
}
export interface UpdateChecklistItemRequest {
    name?: string;
    is_completed?: boolean;
}
export interface UpdateChecklistItemResponse{
    id: string;
    name: string;
    is_completed: boolean;
    updated_at: string;
}
export interface DeleteChecklistItemResponse{
    id: string;
}