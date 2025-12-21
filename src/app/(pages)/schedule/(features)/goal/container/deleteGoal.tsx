import { AppAlertDialog } from "@/components/common";
import { ModelType } from "../../../_constant";
import { useModalParams } from "../../daily/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useAxiosMutation, useToastState } from "@/hooks";
import { DeleteGoalMutationResponse } from "../_models/type/mutation.type";
import GoalApiUrl from "@/api/goal";

const buttonProps = {
    delete: {
        title: "Xác nhận xóa mục tiêu",
        description: "Bạn có chắc chắn muốn xóa mục tiêu này? Hành động này không thể hoàn tác.",
        submitButtonText: "Xóa",
        cancelButtonText: "Hủy Bỏ",
    },
};

interface DeleteGoalProps {
    refetch?: () => void;
}

export const DeleteGoal = ({ refetch }: DeleteGoalProps) => {
    const { mode } = useModalParams();
    const openAlertDialog = mode === ModelType.DELETE;
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { setToast } = useToastState();

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/schedule/goal?${params.toString()}`, { scroll: false });
    }

    const { sendRequest: deleteGoal, } = useAxiosMutation<DeleteGoalMutationResponse>({
        method: "DELETE",
        url: GoalApiUrl.deleteGoal,
        headers: { "Content-Type": "application/json" }
    });

    const handleDelete = async () => {
        if (!id) return;
        const { data, error } = await deleteGoal(undefined, id);

        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể xóa mục tiêu",
                variant: "error",
                closeable: false
            });
            return;
        }

        if (data?.is_success) {
            closeModal();
            setToast({
                title: "Thành công",
                message: "Mục tiêu đã được xóa thành công",
                variant: "success",
                closeable: true
            });
            if (refetch) {
                refetch();
            }
        } else {
            setToast({
                title: "Thất bại",
                message: data?.message ?? "Xóa mục tiêu không thành công",
                variant: "error",
                closeable: true
            });
        }
    }

    return (
        <div>
            <AppAlertDialog
                title={buttonProps.delete.title}
                description={buttonProps.delete.description}
                open={openAlertDialog}
                setOpen={(open) => {
                    if (!open) closeModal();
                }}
                submitText={buttonProps.delete.submitButtonText}
                onSubmit={handleDelete}
            />
        </div>
    )
}
