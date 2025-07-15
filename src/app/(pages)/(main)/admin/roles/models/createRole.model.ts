export interface CreateRoleModel {
    name: string;
    description?: string;
    isActive: boolean;
    permissionIds: string[];
}