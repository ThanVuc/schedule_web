"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCancelButton,
  DialogContent,
  DialogDangerButton,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../common/TeamDialog";
import { Trash2 } from "lucide-react";
import { teamGroupApiUrl, teamMemberApiUrl } from "@/api/teamGroup";
import { useAxios, useAxiosMutation, useToastState } from "@/hooks";
import { format } from "date-fns";
import profileApiUrl from "@/api/profile";

type GroupDetailApiModel = {
  id?: string;
  group_id?: string;
  name?: string;
  group_name?: string;
  description?: string | null;
  created_at?: string;
  member_total?: number;
  member_count?: number;
  members_count?: number;
  my_role?: string | { name?: string } | null;
  role?: string | { name?: string } | null;
};

type MemberApiModel = {
  id?: string;
  user_id?: string;
  role?: string | number | { name?: string } | null;
  user?: { id?: string };
};

const BoardSettingPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { setToast } = useToastState();
  const groupId = params?.id ?? "";
  const altGroupId = (searchParams.get("altGroupId") ?? "").trim();
  const [activeGroupId, setActiveGroupId] = useState(groupId);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  useEffect(() => {
    setActiveGroupId(groupId);
  }, [groupId]);

  const {
    data: groupDetailRaw,
    loading,
    error: groupDetailError,
    refetch,
  } = useAxios<unknown>(
    {
      method: "GET",
      url: teamGroupApiUrl.detail(activeGroupId),
    },
    [activeGroupId],
    !activeGroupId,
  );
  const { data: membersRaw } = useAxios<unknown>(
    {
      method: "GET",
      url: teamMemberApiUrl.list(activeGroupId),
    },
    [activeGroupId],
    !activeGroupId,
  );
  const { data: myProfileRaw } = useAxios<unknown>({
    method: "GET",
    url: profileApiUrl.getUserProfile,
  });

  const groupDetail = useMemo(() => {
    const raw = groupDetailRaw as any;
    if (!raw) return null;
    if (raw.name || raw.group_name || raw.member_total !== undefined) {
      return raw as GroupDetailApiModel;
    }
    if (raw.group) return raw.group as GroupDetailApiModel;
    if (raw.item) return raw.item as GroupDetailApiModel;
    if (raw.data && (raw.data.name || raw.data.group_name)) {
      return raw.data as GroupDetailApiModel;
    }
    return raw as GroupDetailApiModel;
  }, [groupDetailRaw]);

  useEffect(() => {
    if (!groupDetail) return;
    setGroupName(groupDetail.name ?? groupDetail.group_name ?? "");
    setDescription(groupDetail.description ?? "");
  }, [groupDetail]);

  const { sendRequest: updateGroupRequest } = useAxiosMutation({
    method: "PATCH",
    url: teamGroupApiUrl.list,
  });
  const { sendRequest: deleteGroupRequest } = useAxiosMutation({
    method: "DELETE",
    url: teamGroupApiUrl.list,
  });

  const hasForbiddenError =
    groupDetailError?.response?.status === 403 ||
    groupDetailError?.response?.status === 422 ||
    groupDetailError?.response?.status === 404;

  const isRetryPending =
    hasForbiddenError && !!altGroupId && activeGroupId !== altGroupId;

  useEffect(() => {
    if (!hasForbiddenError || !altGroupId || activeGroupId === altGroupId) return;
    setActiveGroupId(altGroupId);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("altGroupId");
    router.replace(`/te/group/${altGroupId}?${next.toString()}`, { scroll: false });
  }, [activeGroupId, altGroupId, hasForbiddenError, router, searchParams]);

  const normalizeRole = (
    role?:
      | GroupDetailApiModel["my_role"]
      | GroupDetailApiModel["role"]
      | MemberApiModel["role"],
  ) => {
    const roleText = (() => {
      if (!role) return "";
      if (typeof role === "string" || typeof role === "number") return String(role);
      if (
        typeof role === "object" &&
        "name" in role &&
        typeof role.name === "string"
      ) {
        return role.name;
      }
      return "";
    })();
    const normalized = roleText.trim().toLowerCase();
    if (normalized === "owner" || normalized === "1") return "Owner";
    if (normalized === "manager" || normalized === "2") return "Manager";
    if (normalized === "member" || normalized === "3") return "Member";
    if (normalized === "viewer" || normalized === "4") return "Viewer";
    return "Member";
  };

  const myProfile = useMemo(() => {
    const raw = myProfileRaw as any;
    if (!raw) return null;
    if (raw.id || raw.email || raw.fullname) return raw as { id?: string };
    if (raw.data && (raw.data.id || raw.data.email || raw.data.fullname)) {
      return raw.data as { id?: string };
    }
    if (raw.item && (raw.item.id || raw.item.email || raw.item.fullname)) {
      return raw.item as { id?: string };
    }
    if (raw.user && (raw.user.id || raw.user.email || raw.user.fullname)) {
      return raw.user as { id?: string };
    }
    return null;
  }, [myProfileRaw]);

  const membersFromApi = useMemo(() => {
    const raw = membersRaw as any;
    if (!raw) return [] as MemberApiModel[];
    if (Array.isArray(raw)) return raw as MemberApiModel[];
    if (Array.isArray(raw.items)) return raw.items as MemberApiModel[];
    if (Array.isArray(raw.members)) return raw.members as MemberApiModel[];
    if (Array.isArray(raw.data)) return raw.data as MemberApiModel[];
    if (raw.data && Array.isArray(raw.data.items)) return raw.data.items as MemberApiModel[];
    if (raw.result && Array.isArray(raw.result.items)) return raw.result.items as MemberApiModel[];
    return [] as MemberApiModel[];
  }, [membersRaw]);

  const roleFromMembers = useMemo(() => {
    const meId = (myProfile?.id ?? "").trim();
    if (!meId) return "";
    const myMember = membersFromApi.find((member) => {
      const memberId = member.user_id ?? member.user?.id ?? member.id ?? "";
      return memberId === meId;
    });
    if (!myMember) return "";
    return normalizeRole(myMember.role);
  }, [membersFromApi, myProfile?.id]);

  const groupInfo = useMemo(
    () => ({
      groupId: activeGroupId,
      createdAt: groupDetail?.created_at
        ? format(new Date(groupDetail.created_at), "dd/MM/yyyy HH:mm")
        : "-",
      members:
        membersFromApi.length ||
        groupDetail?.member_total ||
        groupDetail?.member_count ||
        groupDetail?.members_count ||
        0,
      yourRole: roleFromMembers || normalizeRole(groupDetail?.my_role ?? groupDetail?.role),
    }),
    [activeGroupId, groupDetail, membersFromApi.length, roleFromMembers],
  );
  const isOwner = groupInfo.yourRole === "Owner";

  const handleSave = async () => {
    if (!isOwner) {
      setToast({
        title: "Không có quyền",
        message: "Chỉ Owner mới có thể thay đổi tên hoặc mô tả nhóm.",
        variant: "warning",
      });
      return;
    }
    const trimmedName = groupName.trim();
    const payload: {
      name?: string;
      description?: string;
    } = {};

    if (trimmedName) payload.name = trimmedName;
    payload.description = description.trim();

    if (!payload.name) {
      setToast({
        title: "Cập nhật thất bại",
        message: "Tên nhóm không được để trống.",
        variant: "warning",
      });
      return;
    }

    let result = await updateGroupRequest(payload, activeGroupId);
    if (
      result.error &&
      altGroupId &&
      altGroupId !== activeGroupId &&
      [404, 422].includes(result.error.response?.status || 0)
    ) {
      result = await updateGroupRequest(payload, altGroupId);
    }

    if (result.error) {
      setToast({
        title: "Cập nhật thất bại",
        message: "Không thể lưu thay đổi nhóm.",
        variant: "error",
      });
      return;
    }

    setToast({
      title: "Thành công",
      message: "Đã lưu thông tin nhóm.",
      variant: "success",
    });
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("groupName", trimmedName);
    router.replace(`/te/group/${activeGroupId}?${nextParams.toString()}`, { scroll: false });
    window.dispatchEvent(new CustomEvent("group-updated"));
    refetch?.();
  };

  const expectedDeleteName =
    groupDetail?.name ?? groupDetail?.group_name ?? groupName;
  const canDelete =
    deleteConfirmName.trim().length > 0 &&
    deleteConfirmName.trim() === expectedDeleteName.trim();

  const handleDelete = async () => {
    if (!isOwner) {
      setToast({
        title: "Không có quyền",
        message: "Chỉ Owner mới có thể xóa nhóm.",
        variant: "warning",
      });
      return;
    }
    if (!canDelete) {
      setToast({
        title: "Xóa nhóm thất bại",
        message: "Vui lòng nhập đúng tên nhóm để xác nhận xóa.",
        variant: "warning",
      });
      return;
    }

    let result = await deleteGroupRequest(undefined, activeGroupId);
    if (
      result.error &&
      altGroupId &&
      altGroupId !== activeGroupId &&
      [404, 422].includes(result.error.response?.status || 0)
    ) {
      result = await deleteGroupRequest(undefined, altGroupId);
    }

    if (result.error) {
      setToast({
        title: "Xóa nhóm thất bại",
        message: "Không thể xóa nhóm. Vui lòng thử lại.",
        variant: "error",
      });
      return;
    }

    setDeleteOpen(false);
    setDeleteConfirmName("");
    setToast({
      title: "Thành công",
      message: "Đã xóa nhóm.",
      variant: "success",
    });
    router.push("/te/group");
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Settings */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Cài đặt cơ bản
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Tên nhóm</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={!isOwner || (hasForbiddenError && !isRetryPending)}
                className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={!isOwner || (hasForbiddenError && !isRetryPending)}
                className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#42A5F5]/60 focus:ring-1 focus:ring-[#42A5F5]/30"
              />
            </div>
            {!isOwner && (
              <p className="text-xs text-amber-300">
                Chỉ Owner mới có quyền chỉnh sửa tên và mô tả nhóm.
              </p>
            )}
          </div>
        </section>

        {/* Group Information */}
        <section className="pt-2 space-y-4 border-t border-[#1E2A3A]">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Thông tin nhóm
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Mã nhóm</label>
              <Input
                value={groupInfo.groupId}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Ngày tạo</label>
              <Input
                value={groupInfo.createdAt}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Số thành viên</label>
              <Input
                value={String(groupInfo.members)}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Vai trò của bạn</label>
              <Input
                value={groupInfo.yourRole}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={!isOwner || (hasForbiddenError && !isRetryPending) || loading}
              className="bg-[#1565C0] hover:bg-[#1976D2] text-white px-4"
            >
              Lưu thay đổi
            </Button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-6">
          <div className="rounded-lg border border-red-900/40 bg-red-950/10 p-4">
            <h3 className="text-sm font-semibold text-red-300">Vùng nguy hiểm</h3>
            <p className="text-xs text-red-200/70 mt-1">
              Các hành động dưới đây không thể hoàn tác. Vui lòng cẩn thận.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-gray-200 font-medium">
                  Xóa nhóm
                </div>
                <div className="text-xs text-red-200/70">
                  Xóa vĩnh viễn nhóm và toàn bộ dữ liệu liên quan
                </div>
              </div>

              <Button
                className="bg-red-700 hover:bg-red-600 text-white px-4"
                disabled={!isOwner || (hasForbiddenError && !isRetryPending)}
                onClick={() => setDeleteOpen(true)}
              >
                Xóa nhóm
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent size="sm">
          <DialogHeader
            icon={<Trash2 size={18} className="text-red-400" />}
          >
            <DialogTitle>Xóa nhóm</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-3">
              <p className="text-sm text-gray-300 leading-relaxed">
                Nhập chính xác tên nhóm <span className="font-semibold text-white">{expectedDeleteName}</span> để xác nhận xóa.
              </p>
              <Input
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder={expectedDeleteName || "Tên nhóm"}
                className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <DialogCancelButton
                onClick={() => {
                  setDeleteConfirmName("");
                  setDeleteOpen(false);
                }}
              >
                Hủy
              </DialogCancelButton>
            </DialogClose>
            <DialogDangerButton onClick={handleDelete} disabled={!canDelete}>
              Xóa nhóm
            </DialogDangerButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardSettingPage;