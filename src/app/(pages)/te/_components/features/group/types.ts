export type Role = "Owner" | "Manager" | "Member" | "Viewer";

export interface Group {
    id: string;
    name: string;
    updatedAt: string;
    memberCount: number;
    role: Role;
    avatarUrl?: string;
}