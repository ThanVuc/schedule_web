export type Role = "Owner" | "Manager" | "Member" | "Viewer";

export interface Group {
    id: string;
    altGroupId?: string;
    name: string;
    description?: string | null;
    createdAt?: string;
    updatedAt: string;
    memberCount: number;
    role: Role;
    avatarUrl?: string;
    activeSprint?: string | null;
}