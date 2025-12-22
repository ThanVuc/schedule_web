import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../daily/hooks";
import { useAxios, useAxiosMutation, useConfirmDialog, useToastState } from "@/hooks";
import LabelApiUrl from "@/api/label";
import { useEffect, useMemo } from "react";
import { CreateGoalMutationResponse, UpdateGoalMutationResponse } from "../_models/type/mutation.type";
import { UpsertGoalSchema } from "../_models/schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GoalApiUrl from "@/api/goal";
import { useForm } from "react-hook-form";
import { AppDialog } from "@/components/common";
import { Button, Form } from "@/components/ui";
import UpsertGoalForm from "../_components/upsertGoalForm";
import type { GoalDetailModel, GoalLabelsGroup } from "../_models/type/goalCard.type";
import { ModelType } from "../../../_constant";

const buttonProps = {
    View: {
        title: "Xem thông tin mục tiêu",
        submitButtonText: null,
        cancelButtonText: "Đóng",
    },
    Create: {
        title: "Tạo mục tiêu mới",
        submitButtonText: " Tạo mục tiêu",
        cancelButtonText: "Đóng",
    },
    Update: {
        title: "Chỉnh sửa mục tiêu",
        submitButtonText: "Lưu mục tiêu",
        cancelButtonText: "Đóng",
    }
};

interface UpsertGoalProps {
    refetch?: () => void;
}

const UpsertGoal = ({ refetch }: UpsertGoalProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode } = useModalParams();
    const openDialog = mode === ModelType.CREATE || mode === ModelType.UPDATE || mode === ModelType.VIEW;
    const isDisabled = mode === ModelType.VIEW;
    const buttonData = buttonProps[mode as keyof typeof buttonProps] ?? buttonProps.Create;
    const { confirm, dialog } = useConfirmDialog();
    const { setToast } = useToastState();

    const id = useMemo(() => {
        try {
            return searchParams?.get?.("id") ?? undefined;
        } catch {
            return undefined;
        }
    }, [searchParams]);

    const { data: labelDefaultData } = useAxios<GoalLabelsGroup>({
        method: "GET",
        url: LabelApiUrl.getDefault,
    }, [], !openDialog);

    const form = useForm<z.infer<typeof UpsertGoalSchema>>({
        resolver: zodResolver(UpsertGoalSchema),
    });

    const { data: goalData } = useAxios<GoalDetailModel>(
        {
            method: "GET",
            url: `${GoalApiUrl.getListGoals}/${id}`,
            headers: { "Content-Type": "application/json" }
        },
        [id],
        !id || (mode !== ModelType.UPDATE && mode !== ModelType.VIEW)
    );

    useEffect(() => {
        if (mode === ModelType.CREATE && labelDefaultData) {
            form.reset({
                name: "",
                start_date: Date.now(),
                end_date: Date.now(),
                status_id: labelDefaultData.status?.id,
                difficulty_id: labelDefaultData.difficulty?.id,
                priority_id: labelDefaultData.priority?.id,
                category_id: labelDefaultData.category?.id,
                short_descriptions: "",
                detailed_description: "",
                tasks: [],
            });
            return;
        }

        if (goalData && (mode === ModelType.UPDATE || mode === ModelType.VIEW)) {

            form.reset({
                name: goalData.name ?? "",
                start_date: goalData.start_date ?? 0,
                end_date: goalData.end_date ?? 0,
                status_id: goalData.goalLabels.status.id,
                difficulty_id: goalData.goalLabels.difficulty.id,
                priority_id: goalData.goalLabels.priority.id,
                category_id: goalData.goalLabels.category.id,
                short_descriptions: goalData.short_descriptions ?? "",
                detailed_description: goalData.detailed_description ?? "",
                tasks: goalData.tasks?.map(task => ({
                    name: task.name,
                    is_completed: task.is_completed,
                })) ?? [],
            });
        }

        form.clearErrors();
    }, [labelDefaultData, mode, goalData, form]);


    const defaultLabels = useMemo(() => {
        if (!id && !goalData) return labelDefaultData;

        const goalLabels = goalData?.goalLabels;
        const labels: GoalLabelsGroup | null = goalLabels
            ? {
                category: goalLabels.category,
                difficulty: goalLabels.difficulty,
                priority: goalLabels.priority,
                status: goalLabels.status,
            }
            : null;
        return labels;

    }, [labelDefaultData, goalData, id])

    const { sendRequest: createGoal } = useAxiosMutation<CreateGoalMutationResponse, z.infer<typeof UpsertGoalSchema>>({
        method: "POST",
        url: GoalApiUrl.createGoal,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const { sendRequest: updateGoal } = useAxiosMutation<UpdateGoalMutationResponse, z.infer<typeof UpsertGoalSchema>>({
        method: "POST",
        url: `${GoalApiUrl.updateGoal}/${id}`,
        headers: { "Content-Type": "application/json" }
    });

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/schedule/goal?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const handleCreate = async (values: z.infer<typeof UpsertGoalSchema>) => {
        const { data, error } = await createGoal(values);
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể thêm mục tiêu",
                variant: "error",
                closeable: false
            });
            return;
        }
        if (data?.is_success) {
            closeModal();
            setToast({
                title: "Thành công",
                message: "Mục tiêu được thêm thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        } else {
            setToast({
                title: "Thất bại",
                message: data?.message ?? "Tạo mục tiêu không thành công",
                variant: "error",
                closeable: true
            });
        }
    }

    const handleUpdate = async (values: z.infer<typeof UpsertGoalSchema>) => {
        try {
            const { data, error } = await updateGoal(values);
            if (error) {
                setToast({
                    title: "Lỗi hệ thống",
                    message: "Không thể cập nhật mục tiêu",
                    variant: "error",
                    closeable: false
                });
                return;
            }
            if (data?.is_success) {
                closeModal();
                setToast({
                    title: "Thành công",
                    message: "Mục tiêu đã được cập nhật",
                    variant: "success",
                    closeable: true
                });
                if (refetch) refetch();
            } else {
                setToast({
                    title: "Thất bại",
                    message: data?.message ?? "Cập nhật không thành công",
                    variant: "error",
                    closeable: true
                });
            }
        } catch (e) {
            console.error("handleUpdate error", e);
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể cập nhật mục tiêu",
                variant: "error",
                closeable: false
            });
        }
    }

    const onSubmit = async (values: z.infer<typeof UpsertGoalSchema>) => {
        if (isDisabled) return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === ModelType.CREATE) {
            await handleCreate(values);
        }

        if (mode === ModelType.UPDATE) {
            await handleUpdate(values);
        }
    }
    const handleSwitchToUpdate = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", ModelType.UPDATE);
        if (id) {
            params.set("id", id);
        }
        router.push(`/schedule/goal?${params.toString()}`, { scroll: false });
    }
    const SwitchUpdate = mode === ModelType.VIEW ? (
        <Button
            type="button"
            onClick={handleSwitchToUpdate}
            variant="default"
        >
            Chỉnh sửa
        </Button>
    ) : null

    return (
        <>
            <AppDialog
                dialogTitle={buttonData.title}
                submitButtonText={buttonData.submitButtonText}
                cancelButtonText={buttonData.cancelButtonText}
                onClose={closeModal}
                onSubmit={() => form.handleSubmit(onSubmit)()}
                open={openDialog}
                BottomComponent={SwitchUpdate}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <UpsertGoalForm isDisabled={isDisabled} form={form} defaultLabel={defaultLabels} />
                    </form>
                </Form>
            </AppDialog>
            {dialog}
        </>
    )
}

export default UpsertGoal;