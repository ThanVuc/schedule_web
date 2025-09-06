"use client";
import { AppDialog } from "@/components/common";
import useToastState from "@/hooks/useToasts";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useAxios, useConfirmDialog, } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../permissions/hooks";
import { UpsertUserSchema } from "../models/schema/sertUser.schema";
import { UpsertUserForm } from "../components/upsertUserForm";
import { UserModel } from "../models";
import { userApiUrl } from "@/api/users.api";
import { useEffect } from "react";

export interface AddUserProps {
    refetch?: () => void;
}

const buttonProps = {
    view: {
        title: "Xem Vai Trò",
        description: "Thông tin chi tiết về vai trò",
        submitButtonText: null,
        cancelButtonText: "Đóng",
    },
};



export const UpsertUser = ({
}: AddUserProps) => {

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
    const changeEmailToUsername = (email: string) => {
        const atIndex = email.indexOf("@");
        if (atIndex === -1) return email;
        return email.substring(0, atIndex);
    }


    const { setToast } = useToastState();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mode, id } = useModalParams();
    const openDialog = mode === "view";
    const isDisabled = mode === "view";
    const { confirm, dialog } = useConfirmDialog();
    const buttonData = buttonProps.view;

    const { data: dataGetById, error: errorGetById } = useAxios<UserModel>({
        method: "GET",
        url: `${userApiUrl.getByIdUsers}/${id}`,
        headers: { "Content-Type": "application/json" },
    },
        [id],
        id === null || mode === "edit"
    );




    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/admin/users?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    useEffect(() => {
        if (dataGetById) {
            form.reset({
                name: changeEmailToUsername(dataGetById.email),
                email: dataGetById.email,
                createdAt: timeDiffFromNow(dataGetById.created_at),
                lastUpdateAt: timeDiffFromNow(dataGetById.updated_at),
                role: dataGetById.roles?.map((role) => role.name) ?? [],
                lastLoginAt: timeDiffFromNow(dataGetById.last_login_at),
            });
        }
    }, [dataGetById]);

    useEffect(() => {
        if (errorGetById) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải thông tin vai trò",
                variant: "error",
            });
        }
    }, [errorGetById]);


    const form = useForm<z.infer<typeof UpsertUserSchema>>({
        resolver: zodResolver(UpsertUserSchema),
        defaultValues: {
            name: "",
            email: "",
            lastLoginAt: "",
            lastUpdateAt: "",
            createdAt: "",
            role: [],
        }
    });



    const onSubmit = async () => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
    }


    return (
        <>
            <AppDialog
                dialogTitle={buttonData.title}
                dialogDescription={buttonData.description}
                open={openDialog}
                width="small"
                height="large"
                onClose={closeModal}
                onSubmit={() => {
                    form.handleSubmit(onSubmit)();
                }}
                submitButtonText={isDisabled ? null : buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <UpsertUserForm form={form} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}