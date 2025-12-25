import { AppAlertDialog, AppDialog } from "@/components/common";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { upsertScheduleSchema } from "../_models/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "@/components/ui";
import { useModalParams } from "../hooks";
import { useConfirmDialog } from "@/hooks/useConfirmAlertDialog";
import UpsertScheduleForm from "../_components/upsertScheduleForm";
import { useAlertDialog, useAxios, useAxiosMutation } from "@/hooks";
import { CreateWorkMutationResponseType, DeleteWorkMutationResponseType, UpdateWorkMutationResponseType, UpsertWorkRequest, ViewUpWorkRequest } from "../_models/type/mutation.type";
import { worksApiUrl } from "@/api/work";
import useToastState from "@/hooks/useToasts";
import { formatDate } from "@/app/(pages)/(main)/profile/utils";
import { labelDefault } from "../_models/type/label";
import { LabelApiUrl } from "@/api/label";
import {useEffect, useState } from "react";
import Spinner from "@/components/common/spinner";
import { ModelType } from "../../../_constant";


const buttonProps = {
    View: {
        title: "Xem thông tin công việc",
        description: "Thông tin chi tiết về công việc",
        submitButtonText: "Tạo công việc",
        cancelButtonText: "Đóng",
    },
    Create: {
        title: "Tạo công việc mới",
        description: "Nhập thông tin để tạo công việc mới",
        submitButtonText: "Tạo công việc",
        cancelButtonText: "Hủy",
    },
    Update: {
        title: "Chỉnh sửa công việc",
        description: "Cập nhật thông tin công việc",
        submitButtonText: "Lưu thay đổi",
        cancelButtonText: "Hủy",
    },
};
interface UpsertScheduleProps {
    refetch?: () => void;
}

const UpsertSchedule = ({ refetch }: UpsertScheduleProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode, id } = useModalParams();
    const openDialog = mode === ModelType.CREATE || mode === ModelType.UPDATE || mode === ModelType.VIEW;
    const isCreateMode = mode === ModelType.CREATE;
    const isDisabled = mode === ModelType.VIEW;
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.Create;
    const { confirm, dialog } = useConfirmDialog();
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();
    const { setToast } = useToastState();
    const [formReady, setFormReady] = useState(false);
    const handlePageQueryToModal = (mode: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        if (id) {
            params.set("id", id)
        } else {
            params.delete("id");
        }

        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
    }
    const mapNotificationsToForm = (
        notifications: UpsertWorkRequest["notifications"] | undefined,
        startDate: number
    ) => {
        const result = {
            beforeFiveMinApp: false,
            beforeThirtyMinApp: false,
            beforeFiveMinEmail: false,
            beforeThirtyMinEmail: false,
        };

        if (!notifications || !startDate) return result;

        notifications.forEach(n => {
            const diff = startDate - n.trigger_at;

            if (Math.abs(diff) === 5 * 60 * 1000) {
                if (n.is_send_mail) result.beforeFiveMinEmail = n.is_active;
                else result.beforeFiveMinApp = n.is_active;
            }

            if (Math.abs(diff) === 30 * 60 * 1000) {
                if (n.is_send_mail) result.beforeThirtyMinEmail = n.is_active;
                else result.beforeThirtyMinApp = n.is_active;
            }
        });

        return result;
    };

    const { data: labelDefaultData } = useAxios<labelDefault>({
        method: "GET",
        url: LabelApiUrl.getDefault,
    }, undefined, !isCreateMode);

    const { sendRequest } = useAxiosMutation<CreateWorkMutationResponseType, UpsertWorkRequest>({
        method: "POST",
        url: worksApiUrl.createWork,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { sendRequest: sendUpdateRequest } = useAxiosMutation<UpdateWorkMutationResponseType, UpsertWorkRequest>({
        method: "POST",
        url: worksApiUrl.updateWork,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { data: dataGetById, error: errorGetById } = useAxios<ViewUpWorkRequest>({
        method: "GET",
        url: `${worksApiUrl.getWorkById}/${id}`,
    },
        [id],
        id === null || mode === ModelType.CREATE || mode === ModelType.DELETE
    );
    const { sendRequest: sendRequestDelete } = useAxiosMutation<DeleteWorkMutationResponseType>({
        method: "DELETE",
        url: worksApiUrl.deleteWork,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const form = useForm<z.infer<typeof upsertScheduleSchema>>({
        resolver: zodResolver(upsertScheduleSchema),
        defaultValues: {
            name: "",
            start_date: formatDate.dateToNumber(new Date()) || Date.now(),
            end_date: formatDate.dateToNumber(new Date()) || Date.now(),
            goal_id: "",
            type_id: "",
            status_id: "",
            difficulty_id: "",
            priority_id: "",
            category_id: "",
            short_descriptions: "",
            detailed_description: "",
            notifications: {
                beforeFiveMinApp: false,
                beforeThirtyMinApp: false,
                beforeFiveMinEmail: false,
                beforeThirtyMinEmail: false,
            },
            sub_tasks: [],
        },
    });
    useEffect(() => {
        setFormReady(false);
    }, [mode, id]);

    useEffect(() => {
        if (mode === ModelType.CREATE && labelDefaultData) {
            form.reset({
                ...form.getValues(),
                type_id: labelDefaultData?.type.id,
                status_id: labelDefaultData?.status.id,
                difficulty_id: labelDefaultData?.difficulty.id,
                priority_id: labelDefaultData?.priority.id,
                category_id: labelDefaultData?.category.id,
            });
            setFormReady(true);
        }
    }, [labelDefaultData]);
    useEffect(() => {
        if (errorGetById) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải thông tin công việc",
                variant: "error",
            });
        }
    }, [errorGetById]);
    useEffect(() => {
        if (mode !== ModelType.CREATE && mode !== ModelType.DELETE && dataGetById) {
            form.reset({
                name: dataGetById.name,
                start_date: dataGetById.start_date,
                end_date: dataGetById.end_date,
                goal_id: dataGetById.goal_id ?? "",
                type_id: dataGetById.labels.type.id,
                status_id: dataGetById.labels.status.id,
                difficulty_id: dataGetById.labels.difficulty.id,
                priority_id: dataGetById.labels.priority.id,
                category_id: dataGetById.labels.category.id,
                short_descriptions: dataGetById.short_descriptions,
                detailed_description: dataGetById.detailed_description,
                notifications: mapNotificationsToForm(
                    dataGetById.notifications,
                    dataGetById.start_date
                ),
                sub_tasks: dataGetById.sub_tasks ?? [],
            });
            setFormReady(true);

        }
    }, [mode, dataGetById]);


    useEffect(() => {
        if (mode === ModelType.CREATE) {
            form.reset({
                name: "",
                start_date: formatDate.dateToNumber(new Date()) || Date.now(),
                end_date: formatDate.dateToNumber(new Date()) || Date.now(),
                goal_id: "",
                type_id: "",
                status_id: "",
                difficulty_id: "",
                priority_id: "",
                category_id: "",
                short_descriptions: "",
                detailed_description: "",
                notifications: {
                    beforeFiveMinApp: false,
                    beforeThirtyMinApp: false,
                    beforeFiveMinEmail: false,
                    beforeThirtyMinEmail: false,
                },
                sub_tasks: [],
            });
        }
    }, [mode]);

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }
    const handleCreate = async (values: z.infer<typeof upsertScheduleSchema>) => {
        const currentDate = values.start_date ?? 0;
        const beforeThirtyMin = currentDate - 30 * 60 * 1000;
        const beforeFiveMin = currentDate - 5 * 60 * 1000;
        let StateNotificationMail = false;
        let timeNotificationMail = 0;
        if (values.notifications.beforeThirtyMinEmail) {
            StateNotificationMail = true;
            timeNotificationMail = beforeThirtyMin;
        }
        else if (values.notifications.beforeFiveMinEmail) {
            StateNotificationMail = true;
            timeNotificationMail = beforeFiveMin;
        }
        if (values.goal_id === "0") {
            values.goal_id = undefined;
        }
        const work: UpsertWorkRequest = {
            name: values.name,
            start_date: values.start_date,
            end_date: values.end_date,
            goal_id: values.goal_id,
            type_id: values.type_id,
            status_id: values.status_id,
            difficulty_id: values.difficulty_id,
            priority_id: values.priority_id,
            category_id: values.category_id,
            short_descriptions: values.short_descriptions ?? "",
            detailed_description: values.detailed_description ?? "",
            notifications: [
                {
                    trigger_at: beforeFiveMin,
                    is_send_mail: false,
                    is_active: values.notifications.beforeFiveMinApp || false,
                    link: "https://www.schedulr.site/schedule/works/" + searchParams.get("id"),
                },
                {
                    trigger_at: beforeThirtyMin,
                    is_send_mail: false,
                    is_active: values.notifications.beforeThirtyMinApp || false,
                    link: "https://www.schedulr.site/schedule/works/" + searchParams.get("id"),
                },
                {
                    trigger_at: timeNotificationMail,
                    is_send_mail: StateNotificationMail,
                    is_active: StateNotificationMail || false,
                    link: "https://www.schedulr.site/schedule/works/" + searchParams.get("id"),
                }
            ],
            sub_tasks: values.sub_tasks?.map(subTask => ({
                name: subTask.name,
                is_completed: subTask.is_completed,
            })) ?? [],
        }
        const { data, error } = await sendRequest(work);
        if (error) {
            const apiError = error.response?.data as CreateWorkMutationResponseType;

            if (apiError?.errorCode === "10005") {
                setToast({
                    title: "Lỗi dữ liệu",
                    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
                    variant: "error",
                    closeable: true,
                });
                return;
            }

            if (apiError?.errorCode === "10006") {
                setToast({
                    title: "Lỗi dữ liệu",
                    message: "Đã có khoảng thời gian trùng lặp với công việc khác",
                    variant: "error",
                    closeable: true,
                });
                return;
            }
            setToast({
                title: "Lỗi hệ thống",
                message: apiError?.message ?? "Không thể thêm lịch trình mới",
                variant: "error",
                closeable: false,
            });
            return;
        }
        if (data?.is_success) {
            closeModal();
            setToast({
                title: "Thành công",
                message: "Lịch trình đã được thêm thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        }
    };
    const handleEdit = async (values: z.infer<typeof upsertScheduleSchema>) => {
        const currentDate = values.start_date ?? 0;
        const beforeThirtyMin = currentDate + 30 * 60 * 1000;
        const beforeFiveMin = currentDate + 5 * 60 * 1000;
        let StateNotificationMail = false;
        let timeNotificationMail = 0;
        if (values.notifications.beforeThirtyMinEmail) {
            StateNotificationMail = true;
            timeNotificationMail = beforeThirtyMin;
        }
        else if (values.notifications.beforeFiveMinEmail) {
            StateNotificationMail = true;
            timeNotificationMail = beforeFiveMin;
        }
        if (values.goal_id === "0") {
            values.goal_id = undefined;
        }
        const work: UpsertWorkRequest = {
            name: values.name,
            start_date: values.start_date,
            end_date: values.end_date,
            goal_id: values.goal_id,
            type_id: values.type_id,
            status_id: values.status_id,
            difficulty_id: values.difficulty_id,
            priority_id: values.priority_id,
            category_id: values.category_id,
            short_descriptions: values.short_descriptions ?? "",
            detailed_description: values.detailed_description ?? "",
            notifications: [
                {
                    trigger_at: beforeFiveMin,
                    is_send_mail: false,
                    is_active: values.notifications.beforeFiveMinApp || false,
                    link: "https://www.schedulr.site/schedule/works/" + searchParams.get("id"),
                },
                {
                    trigger_at: beforeThirtyMin,
                    is_send_mail: false,
                    is_active: values.notifications.beforeThirtyMinApp || false,
                    link: "https://www.schedulr.site/schedule/works/" + searchParams.get("id"),
                },
                {
                    trigger_at: timeNotificationMail,
                    is_send_mail: StateNotificationMail,
                    is_active: StateNotificationMail || false,
                    link: "https://www.schedulr.site/schedule/works/" + searchParams.get("id"),
                }
            ],
            sub_tasks: values.sub_tasks?.map(subTask => ({
                name: subTask.name,
                is_completed: subTask.is_completed,
            })) ?? [],
        }
        const { data, error } = await sendUpdateRequest(work, id ?? undefined);
        if (error) {
            const apiError = error.response?.data as UpdateWorkMutationResponseType;

            if (apiError?.errorCode === "10005") {
                setToast({
                    title: "Lỗi dữ liệu",
                    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
                    variant: "error",
                    closeable: true,
                });
                return;
            }

            if (apiError?.errorCode === "10006") {
                setToast({
                    title: "Lỗi dữ liệu",
                    message: "Đã có khoảng thời gian trùng lặp với công việc khác",
                    variant: "error",
                    closeable: true,
                });
                return;
            }
            setToast({
                title: "Lỗi hệ thống",
                message: apiError?.message ?? "Không thể cập nhật lịch trình mới",
                variant: "error",
                closeable: false,
            });
            return;
        }
        if (data?.is_success) {
            form.reset(values);
            closeModal();
            setToast({
                title: "Thành công",
                message: "Lịch trình đã được cập nhật thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        }
    }

    useEffect(() => {
        if (mode === ModelType.DELETE) {
            setOpenAlertDialog(true);
            setAlertDialogProps({
                title: "Xác nhận xóa công việc",
                description: "Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.",
                submitText: "Xóa",
                onSubmit: async () => {
                    const { error } = await sendRequestDelete( undefined, id?.toString() || "");
                    if (error) {
                        setToast({
                            title: "Xóa công việc",
                            message: "Xóa công việc thất bại",
                            variant: "error",
                        });
                        return;
                    }
                    setToast({
                        title: "Xóa công việc",
                        message: "Xoá công việc thành công",
                        variant: "success",
                    });
                    refetch?.();
                },
                open: true,
                setOpen: setOpenAlertDialog,
            });
            setOpenAlertDialog(true);

        }
    }, [mode]);
    const onSubmit = async (values: z.infer<typeof upsertScheduleSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === ModelType.CREATE) {
            await handleCreate(values);
        } else if (mode === ModelType.UPDATE) {
            await handleEdit(values);
        }
    }
    return (<>
        <AppAlertDialog
            title={alertDialogProps.title || "Xác nhận xóa công việc"}
            description={alertDialogProps.description || "Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác."}
            open={openAlertDialog}
            setOpen={setOpenAlertDialog}
            submitText={alertDialogProps.submitText || "Xóa"}
            onSubmit={() => alertDialogProps.onSubmit?.()}
            onClose={closeModal}
        />
        <AppDialog
            dialogTitle={buttonData.title}
            dialogDescription={buttonData.description}
            submitButtonText={isDisabled ? null : buttonData.submitButtonText}
            cancelButtonText={buttonData.cancelButtonText}
            onClose={closeModal}
            onSubmit={() => form.handleSubmit(onSubmit)()}
            open={openDialog}
            BottomComponent={
                (isDisabled && <Button onClick={() => handlePageQueryToModal(ModelType.UPDATE, searchParams.get("id") || undefined)}>
                    Chuyển đến cập nhật
                </Button>)
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    {formReady ? (<UpsertScheduleForm disabled={isDisabled} form={form} labelDefaultData={isCreateMode ? (labelDefaultData || undefined) : (dataGetById?.labels || undefined)} />
                    ) : (
                        <div className="flex items-center justify-center min-h-[300px]">
                            <Spinner />
                        </div>)}
                </form>
            </Form>
        </AppDialog>
        {dialog}
    </>);
}

export default UpsertSchedule;