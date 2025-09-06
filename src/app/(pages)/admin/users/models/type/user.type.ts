
export interface UserModel {
    user_id: string;
    email: string;
    lock_end: number;
    is_root: boolean;
    lock_reason?: string;
    roles: Role[];
    last_login_at: number;
    failed_attempts?: number;
    created_at: number;
    updated_at: number;
    total_users: number;
}

export interface UsersResponse {
    items: UserModel[];
    total_users: number;
    root: number;
    non_root: number;
    root_percentage: number;
    non_root_percentage: number;
    total_items: number;
    total_pages: number;
    page_size: number;
    page: number;
    has_prev: boolean;
    has_next: boolean;
}
export interface Role {
    role_id: string;
    name: string;
    description: string;
}

