export interface CreateCommentRequest {
    content: string;
}
export interface Creator{
    id: string;
    name: string;
}
export interface CommentResponse {
    id: string;
    content: string;
    creator: Creator;
    created_at: string;
    updated_at: string;
}
export interface UpdateCommentRequest {
    content?: string;
}
export interface UpdateCommentResponse{
    id: string;
    content: string;
    updated_at: string;
}
export interface DeleteChecklistItemResponse{
    comment_id: string;
}