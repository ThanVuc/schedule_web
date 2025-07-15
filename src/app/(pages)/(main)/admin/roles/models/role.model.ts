export interface PermissionModel{
    id: string;
    permissionName: string;
    description?: string;
}

export interface RoleModel{
    id: string;
    name: string;
    description: string;
    permissions: PermissionModel[];
}
