
export interface RoleModel {
    role_id: string;
    name: string;
    description?: string;
    is_root?: boolean;
    permissions?: PermissionModel[];
    created_at?: string;
    updated_at?: string;
    total_users?: number;
    is_active?: boolean;
}

export interface RolesResponse {
    items: RoleModel[];
    total_roles: number;
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
export interface PermissionModel {
    perm_id: string;
    perm_name: string;
    description?: string;
}
export interface PermissionResponse {
    items: PermissionModel[];
}