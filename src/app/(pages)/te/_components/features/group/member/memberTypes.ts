
export type MemberRole = "Owner" | "Manager" | "Member" | "Viewer";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joined: string;
  avatarUrl?: string;
  avatarFallback: string;
}

export interface MemberApiModel {
  id?: string;
  name?: string;
  email?: string;
  role?: string | { name?: string } | null;
  joined_at?: string;
  avatar?: string;
}

export interface ActionsMenuProps {
  member: Member;
  onChangeRole: () => void;
  onRemove: () => void;
}

export interface RoleDefinition {
  value: MemberRole;
  label: string;
  desc: string;
}

export interface RoleDropdownProps {
  value: MemberRole;
  onChange: (r: MemberRole) => void;
  triggerClassName?: string;
}

export interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  currentRole: MemberRole;
  memberId: string;
  groupId: string;
  onSuccess?: () => void;
}

export interface MemberToDelete {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
}

export interface DeleteMemberDialogProps {
  target: MemberToDelete | null;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess?: () => void;
}

export type InviteMemberDialogMode = "form" | "link";

export interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  altGroupId?: string;
  inviteLinkGroupId: string;
  onInviteSuccess?: () => void;
  onActiveGroupResolved?: (newGroupId: string) => void;
}

export interface InviteCodeResponse {
  code?: string;
  invite?: { code?: string };
  item?: { code?: string };
  data?: { code?: string; item?: { code?: string } };
  metadata?: { code?: string; item?: { code?: string } };
}

export type MemberApiErrorBody = {
  detail?: string;
  errorCode?: string;
  message?: string;
  error?: string;
};

export type MemberToastErrorContext = "changeMemberRole" | "removeMember" | "inviteMember";
