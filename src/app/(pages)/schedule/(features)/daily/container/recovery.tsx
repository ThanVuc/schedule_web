"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { recoverySchema } from "../_models/schema/recovery.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { AppDialog } from "@/components/common";
import { ModelType } from "../../../_constant";
import { useModalParams } from "../hooks";
import RecoveryForm from "../_components/recoveryForm";
import { useAxiosMutation, useConfirmDialog, useToastState } from "@/hooks";
import { Form } from "@/components/ui";
import recoveryApiUrl from "@/api/recovery.api";
import { RecoveryMutationResponseType, RecoveryRequest, recoveryRequest } from "../_models/type/mutation.type";



interface RecoveryProps {
    refetch?: () => void;
}

const Recovery = ({ refetch }: RecoveryProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { confirm, dialog } = useConfirmDialog({title: "Xác nhận khôi phục công việc", description: "Bạn có chắc chắn muốn khôi phục công việc?"});
    const { mode } = useModalParams();
    const openDialog = mode === ModelType.RECOVERY;
    const { setToast } = useToastState();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

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
            target_date: today.getTime(),
            source_date: yesterday.getTime(),
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
        const Recovery: RecoveryRequest = {
            source_date: value.source_date,
            target_date: value.target_date,
        };
        const { error } = await sendRequest(Recovery);
        setToast({
            title: "Khôi phục công việc",
            message: "Khôi phục công việc thành công",
            variant: "success",
        });
        if (refetch) refetch();
        if (error) {
            setToast({
                title: "Khôi phục công việc",
                message: "Khôi phục công việc thất bại",
                variant: "error",
            });
            return;
        }
        closeModal();
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