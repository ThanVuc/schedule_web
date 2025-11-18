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


const UpsertSchedule = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode} = useModalParams();
    const openDialog = mode === "create" || mode === "edit" || mode === "view";
    const isDisabled = mode === "view";
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.create;
    const { confirm, dialog } = useConfirmDialog();



    const form = useForm<z.infer<typeof upsertScheduleSchema>>({
        resolver: zodResolver(upsertScheduleSchema),
        defaultValues: {
            title: "",
            start: new Date(),
            end: new Date(),
            goal: "",
            workType: "690f2c2be89fc365524f45cb",
            status: "690f2c2be89fc365524f45cd",
            difficulty: "690f2c2be89fc365524f45d2",
            priority: "690f2c2be89fc365524f45d6",
            category: "690f2c2be89fc365524f45d9",
            shortDescription: "",
            description: "",
            appNotifications: [],
            emailNotifications: "",
            miniTasks: [],
        },
    });
    const closeModel = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }
    const onSubmit = async () => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
    }


    return (<>
        <AppDialog
            dialogTitle={buttonData.title}
            dialogDescription={buttonData.description}
            submitButtonText={isDisabled ? null : buttonData.submitButtonText}
            cancelButtonText={buttonData.cancelButtonText}
            onClose={closeModel}
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