
export interface PermissionModel {
    perm_id: string;
    perm_name: string;
    description?: string;
    is_root: boolean;
    resource: string; 
    actions :string[];
    created_at: string;
    updated_at: string;
}

export interface PermissionResponse {
    items: PermissionModel[];
    total_permissions: number;
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
