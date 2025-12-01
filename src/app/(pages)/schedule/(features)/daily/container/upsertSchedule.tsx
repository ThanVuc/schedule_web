import { AppDialog } from "@/components/common";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { upsertScheduleSchema } from "../_models/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui";
import { useModalParams } from "../hooks";
import { useConfirmDialog } from "@/hooks/useConfirmAlertDialog";
import UpsertScheduleForm from "../_components/upsertScheduleForm";
import { useAxios, useAxiosMutation } from "@/hooks";
import { CreateWorkMutationResponseType } from "../_models/type/mutation.type";
import { worksApiUrl } from "@/api/work";
import useToastState from "@/hooks/useToasts";
import { formatDate } from "@/app/(pages)/(main)/profile/utils";
import { labelDefault } from "../_models/type/label";
import { LabelApiUrl } from "@/api/label";
import { useEffect } from "react";


const buttonProps = {
    view: {
        title: "Xem thông tin công việc",
        description: "Thông tin chi tiết về công việc",
        submitButtonText: "Tạo công việc",
        cancelButtonText: "Đóng",
    },
    create: {
        title: "Tạo công việc mới",
        description: "Nhập thông tin để tạo công việc mới",
        submitButtonText: "Tạo công việc",
        cancelButtonText: "Hủy",
    },
    edit: {
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
    const { mode } = useModalParams();
    const openDialog = mode === "create" || mode === "edit" || mode === "view";
    const isDisabled = mode === "view";
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.create;
    const { confirm, dialog } = useConfirmDialog();
    const { setToast } = useToastState();

    const { data: labelDefaultData } = useAxios<labelDefault>({
        method: "GET",
        url: LabelApiUrl.getDefault,
    }, undefined, !openDialog);
    useEffect(() => {
        if (openDialog && labelDefaultData) {
            form.reset({
                type_id: labelDefaultData?.type_id,
                status_id: labelDefaultData?.status_id,
                difficulty_id: labelDefaultData?.difficulty_id,
                priority_id: labelDefaultData?.priority_id,
                category_id: labelDefaultData?.category_id,
            });
        }
    }, [mode, labelDefaultData]);
    const { sendRequest } = useAxiosMutation<CreateWorkMutationResponseType, z.infer<typeof upsertScheduleSchema>>({
        method: "POST",
        url: worksApiUrl.createWork,
        headers: {
            "Content-Type": "application/json"
        }
    });


    const form = useForm<z.infer<typeof upsertScheduleSchema>>({
        resolver: zodResolver(upsertScheduleSchema),
        defaultValues: {
            name: "",
            start_date: formatDate.dateToNumber(new Date()) ?? undefined,
            end_date: formatDate.dateToNumber(new Date()) ?? undefined,
            goal_id: "",
            type_id: labelDefaultData?.type_id,
            status_id: labelDefaultData?.status_id,
            difficulty_id: labelDefaultData?.difficulty_id,
            priority_id: labelDefaultData?.priority_id,
            category_id: labelDefaultData?.category_id,
            short_descriptions: "",
            detailed_description: "",
            appNotifications: [],
            emailNotifications: "",
            sub_tasks: [],
        },
    });
    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const handleCreate = async (values: z.infer<typeof upsertScheduleSchema>) => {
        const { data, error } = await sendRequest(values);
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể thêm vai trò mới",
                variant: "error",
                closeable: false
            });
            return;
        }
        if (data?.is_success) {
            closeModal();
            setToast({
                title: "Thành công",
                message: "Vai trò đã được thêm thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        }
    };


    const onSubmit = async (values: z.infer<typeof upsertScheduleSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === "create") {
            await handleCreate(values);
        }
    }
    return (<>
        <AppDialog
            dialogTitle={buttonData.title}
            dialogDescription={buttonData.description}
            submitButtonText={isDisabled ? null : buttonData.submitButtonText}
            cancelButtonText={buttonData.cancelButtonText}
            onClose={closeModal}
            onSubmit={() => form.handleSubmit(onSubmit)()}
            open={openDialog}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <UpsertScheduleForm form={form} />
                </form>
            </Form>
        </AppDialog>
        {dialog}
    </>);
}

export default UpsertSchedule;