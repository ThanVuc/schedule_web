"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { recoverySchema } from "../_models/schema/recovery.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { AppAlertDialog, AppDialog } from "@/components/common";
import { ModelType } from "../../../_constant";
import { useModalParams } from "../hooks";
import { useState } from "react";
import RecoveryForm from "../_components/recoveryForm";
import { useAlertDialog, useAxiosMutation, useConfirmDialog, useToastState } from "@/hooks";
import { Form } from "@/components/ui";
import recoveryApiUrl from "@/api/recovery.api";
import { RecoveryMutationResponseType, recoveryRequest } from "../_models/type/mutation.type";



interface RecoveryProps {
    refetch?: () => void;
}

const Recovery = ({ refetch }: RecoveryProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { confirm, dialog } = useConfirmDialog();
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();
    const { mode } = useModalParams();
    const openDialog = mode === ModelType.RECOVERY;
    const { setToast } = useToastState();

    const { sendRequest } = useAxiosMutation<RecoveryMutationResponseType, recoveryRequest>({
        method: "POST",
        url: recoveryApiUrl.recovery,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const form = useForm<z.infer<typeof recoverySchema>>({
        resolver: zodResolver(recoverySchema),
        defaultValues: {
            target_date: 0,
            source_date: 0,
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
    const buttonProps = {
        Recovery: {
            submitButtonText: "Khôi phục",
            cancelButtonText: "Huỷ",
        }
    };
    const HandleRecovery = async (value: z.infer<typeof recoverySchema>) => {

        setOpenAlertDialog(true);
        setAlertDialogProps({
            title: "Xác nhận khôi phục công việc",
            description: "Bạn có chắc chắn muốn khôi phục công việc này? Hành động này không thể hoàn tác.",
            submitText: "Khôi phục",
            onSubmit: async () => {
                const { error } = await sendRequest(value);
                if (error) {
                    setToast({
                        title: "Khôi phục công việc",
                        message: "Khôi phục công việc thất bại",
                        variant: "error",
                    });
                    return;
                }
                setToast({
                    title: "Khôi phục công việc",
                    message: "Khôi phục công việc thành công",
                    variant: "success",
                });
                refetch?.();
            },
            open: true,
            setOpen: setOpenAlertDialog,
        });
    }
    const onSubmit = async (values: z.infer<typeof recoverySchema>) => {
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === ModelType.RECOVERY) {
            HandleRecovery(values)
        }
    }
    return (
        <>
            <AppAlertDialog
                title={alertDialogProps.title}
                description={alertDialogProps.description}
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                submitText={alertDialogProps.submitText}
                onSubmit={() => alertDialogProps.onSubmit?.()}
                onClose={closeModal}
            />
            <AppDialog
                cancelButtonText={buttonProps.Recovery.cancelButtonText}
                submitButtonText={buttonProps.Recovery.submitButtonText}
                onClose={closeModal}
                onSubmit={() => form.handleSubmit(onSubmit)()}
                open={openDialog}
                width="small"
                height="small"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <RecoveryForm form={form} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    );
}

export default Recovery;