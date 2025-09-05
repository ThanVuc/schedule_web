import { useEffect, useMemo, useState } from "react";
import { ActionButton, CardItem, Cards } from "../../_components";
import { AppAlertDialog, AppPagination, AppSearch, H2, Muted } from "@/components/common";
import { useAlertDialog, useAxios, useAxiosMutation } from "@/hooks";
import { userApiUrl } from "@/api/users.api";
import { UserModel, UsersResponse } from "../models/type/user.type";
import useToastState from "@/hooks/useToasts";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, LockIcon, UserIcon } from "lucide-react";
import { UnLockIcon } from "@/components/icon/unlock";
import { ShieldIcon } from "@/components/icon";
import { UpsertUser } from "./upsertUser";
import { GrantingPermission } from "./grantingPermission";
import { LockUser } from "./lockUser";
import { lockUsersMutationResponseType } from "../models";


const ListUserPage = () => {

    const { setToast } = useToastState();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [usersCardItems, setUsersCardItems] = useState<CardItem[]>([]);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);
    const { data, error, refetch } = useAxios<UsersResponse>({
        method: "GET",
        url: userApiUrl.getUsers,
        params: { ...listParams },
    });
    const { sendRequest } = useAxiosMutation<lockUsersMutationResponseType>({
        method: "PUT",
        url: userApiUrl.lockUser,
        headers: {
            "Content-Type": "application/json"
        }
    })


    const timeDiffFromNow = (inputTime: number) => {
        const timestamp = inputTime.toString().length === 10 ? inputTime * 1000 : inputTime;
        const now = Date.now();
        const diffMs = now - timestamp;
        const diffSec = Math.floor(diffMs / 1000);

        if (diffSec < 60) {
            return `${diffSec} giây trước`;
        }

        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) {
            return `${diffMin} phút trước`;
        }

        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) {
            return `${diffHour} giờ trước`;
        }

        const diffDay = Math.floor(diffHour / 24);
        if (diffDay < 30) {
            return `${diffDay} ngày trước`;
        }

        const diffMonth = Math.floor(diffDay / 30);
        if (diffMonth < 12) {
            return `${diffMonth} tháng trước`;
        }

        const diffYear = Math.floor(diffMonth / 12);
        return `${diffYear} năm trước`;
    }
    useEffect(() => {
        if (data && data.items) {
            setUsersCardItems(
                data.items.map(user => ({
                    title: user.email,
                    description: String('Đăng nhập vào: ' + timeDiffFromNow(user.last_login_at ?? 0)),
                    icon: <UserIcon className="w-8 h-8" />,
                    actions: <div className="flex gap-2">{setActionCardOptions(user)}</div>,
                }))
            );
        } else {
            setUsersCardItems([]);
        }
    }, [data]);
    useEffect(() => {
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải danh sách vai trò",
                variant: "error",
            });
        }
    }, [error]);

    const handlePageQueryToModal = (mode: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        if (id) {
            params.set("id", id)
        } else {
            params.delete("id");
        }

        router.push(`/admin/users?${params.toString()}`, { scroll: false });
    }

    const setActionCardOptions = (users: UserModel) => {
        const { user_id, lock_end } = users;
        const day = Math.floor(Date.now() / 1000);
        return [
            <ActionButton
                key="view-trigger"
                variant="outline"
                buttonText="Xem"
                icon={<EyeIcon className="w-4 h-4" />}
                onClick={() => handlePageQueryToModal("view", user_id)}
            />,
            <ActionButton
                key="granting-permission-trigger"
                variant="outline"
                buttonText="Cấp quyền"
                icon={<ShieldIcon className="w-4 h-4" />}
                onClick={() => handlePageQueryToModal("edit", user_id)}
            />,
            lock_end > day ? (<ActionButton
                key="disable"
                className="bg-green-600 hover:bg-green-500 text-white"
                buttonText="Kích hoạt"
                icon={<UnLockIcon className="w-4 h-4" />}
                onClick={() => {
                    setAlertDialogProps({
                        title: "Xác nhận kích hoạt vai trò",
                        description: "Bạn có chắc chắn muốn kích hoạt vai trò này? Hành động này không thể hoàn tác.",
                        submitText: "Kích hoạt",
                        onSubmit: async () => {
                            const { error } = await sendRequest({ user_id, lock_reason: "" });
                            if (error) {
                                setToast({
                                    title: "Kích hoạt vai trò",
                                    message: "Không thể kích hoạt vai trò, vui lòng thử lại sau.",
                                    variant: "error",
                                });
                                return;
                            }
                            setToast({
                                title: "Kích hoạt vai trò",
                                message: "Kích hoạt vai trò thành công.",
                                variant: "success",
                            });
                            refetch?.();
                        },
                        open: true,
                        setOpen: setOpenAlertDialog,
                    });
                    setOpenAlertDialog(true);
                }}
            />) : (
                <ActionButton
                    key="activate"
                    variant="outline"
                    buttonText="Vô hiệu hóa"
                    icon={<LockIcon className="w-4 h-4" />}
                    onClick={() => handlePageQueryToModal("lock", user_id)}
                />
            ),
        ]
    };

    return (<>
        <AppAlertDialog
            title={alertDialogProps.title || "Xác nhận xóa người dùng"}
            description={alertDialogProps.description || "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."}
            open={openAlertDialog}
            setOpen={setOpenAlertDialog}
            submitText={alertDialogProps.submitText || "Xóa"}
            onSubmit={() => alertDialogProps.onSubmit?.()}
        />
        <div className="p-2 flex flex-col gap-4">
            <div className="header">
                <div className="title">
                    <H2>Danh Sách Người Dùng</H2>
                    <Muted className="!text-base">Xem và quản lý các tài khoản có vai trò quản trị hệ thống</Muted>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <AppSearch
                    key="search-role"
                    placeholder="Tìm kiếm người dùng..."
                    className="w-full sm:w-1/3"
                />
            </div>
            <div className="body">
                <Cards key={undefined} cards={usersCardItems} />
            </div>
            <UpsertUser
                refetch={refetch}
            />
            <GrantingPermission
                refetch={refetch}
            />
            <LockUser
                refetch={refetch}
            />
            {
                usersCardItems.length !== 0 && (
                    <div>
                        <AppPagination
                            page={data?.page || 1}
                            total_pages={data?.total_pages || 1}
                            has_next={data?.has_next || false}
                            has_prev={data?.has_prev || false}
                            size={data?.page_size || 10}
                        />
                    </div>
                )
            }

        </div>
    </>);
}

export default ListUserPage;