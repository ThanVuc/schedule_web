'use client';
import { ModelType } from "@/app/(pages)/schedule/_constant/common";
import { useModalParams } from "../../../../../_hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CreateChecklistItemRequest,
    UpdateChecklistItemRequest,
    UpdateChecklistItemResponse,
} from "@/app/(pages)/te/_models/works/schema/index";
import { Form } from "@/components/ui";
import z from "zod";

import { useAxiosMutation, useToastState } from "@/hooks";
import { ChecklistApiUrl } from "@/api/checklist";
import { ChecklistItemResponse } from "@/app/(pages)/te/_models/works/CheckList";
import { ListSimpleSprintResponse, WorkDetailResponse} from "../../../../../_models";
import { useEffect} from "react";
import { UpdateWorkSchema } from "@/app/(pages)/te/_models/works/schema/UpdateWork";
import { DrawerComponent } from "../../work/Drawer";
import DrawerForm from "../../work/DrawerForm";
import CheckListComponent from "../../work/CheckListComponent";
import CommentComponent from "../../work/CommentComponent";
import { Spinner } from "@/components/ui/shadcn-io/spinner";


interface UpdateBacklogDrawerPageProps {
    getBoardWorkDataById?: WorkDetailResponse;
    loadingBoardWork?: boolean;
    refetchBoardWork?: () => void;
    GetListSprint?: ListSimpleSprintResponse[];
    loadingGetListSprint?: boolean;
}

export const UpdateBacklogDrawerPage = ({ getBoardWorkDataById, loadingBoardWork, refetchBoardWork, GetListSprint, loadingGetListSprint }: UpdateBacklogDrawerPageProps) => {
    const { mode, workId } = useModalParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const openDrawer = mode === ModelType.UPDATE
    const { setToast } = useToastState();

    const { sendRequest: createChecklistItem } = useAxiosMutation<ChecklistItemResponse, CreateChecklistItemRequest>({
        method: "POST",
        url: `${ChecklistApiUrl.CreateCheckList}${workId}/checklists`,
        headers: {
            "Content-Type": "application/json"
        }
    })
    const { sendRequest: updateChecklistItem } = useAxiosMutation<UpdateChecklistItemResponse, UpdateChecklistItemRequest>({
        method: "PATCH",
        url: `${ChecklistApiUrl.UpdateCheckList}${workId}/checklists`,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { sendRequest: deleteChecklistItem } = useAxiosMutation<UpdateChecklistItemResponse, UpdateChecklistItemRequest>({
        method: "DELETE",
        url: `${ChecklistApiUrl.DeleteCheckList}${workId}/checklists`,
        headers: {
            "Content-Type": "application/json"
        }
    });


    const isFormLoading =
        mode !== ModelType.CREATE &&
        mode !== ModelType.DELETE &&
        (loadingBoardWork || !getBoardWorkDataById || loadingGetListSprint);

    type UpsertWorkValues = z.infer<typeof UpdateWorkSchema>;
    const form = useForm<UpsertWorkValues>({
        resolver: zodResolver(UpdateWorkSchema),
        defaultValues: {
            name: "",
            description: "",
            status: 1,
            priority: 1,
            due_date: undefined,
            story_point: undefined,
            sprint_id: undefined,
            assignee_id: undefined,
            version: undefined,
        }
    });

    useEffect(() => {
        if (mode !== ModelType.CREATE && mode !== ModelType.DELETE && getBoardWorkDataById) {
            form.reset({
                name: getBoardWorkDataById.name,
                description: getBoardWorkDataById.description,
                status: getBoardWorkDataById.status,
                priority: getBoardWorkDataById.priority,
                due_date: getBoardWorkDataById.due_date,
                story_point: getBoardWorkDataById.story_point,
                sprint_id: getBoardWorkDataById.sprint?.id,
                version: getBoardWorkDataById.version,
            })
        }
    }, [getBoardWorkDataById])


    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }

    const handleCreateChecklistItem = async (payload: CreateChecklistItemRequest) => {
        const { data, error } = await createChecklistItem(payload);
        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể tạo checklist item.",
                variant: "error",
            });
            return null;
        }

        setToast({
            title: "Thành công",
            message: "Đã thêm checklist item.",
            variant: "success",
        });
        await refetchBoardWork?.();

        return data ?? null;
    };

    const handleUpdateChecklistItem = async (
        checklistId: string,
        payload: UpdateChecklistItemRequest,
    ) => {
        const { data, error } = await updateChecklistItem(payload, checklistId);

        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể cập nhật checklist item.",
                variant: "error",
            });
            return null;
        }

        return data ?? null;
    };
    const handleDeleteChecklistItem = async (checklistId: string) => {
        const { data, error } = await deleteChecklistItem(undefined, checklistId);

        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể xóa checklist item.",
                variant: "error",
            });
            return null;
        }

        return data ?? null;
    };
    return (<>
        <DrawerComponent
            open={openDrawer}
            onClose={closeModal}

        >
            {isFormLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Spinner />
                </div>
            ) : (
                <div>
                    <Form {...form}>
                        <form>
                            <DrawerForm version={Number(getBoardWorkDataById?.version)} form={form} listSprint={GetListSprint} />
                        </form>
                    </Form>
                    <div>
                        <CheckListComponent
                            checklistItems={getBoardWorkDataById?.check_list?.items}
                            onCreateItem={handleCreateChecklistItem}
                            onUpdateItem={handleUpdateChecklistItem}
                            onDeleteItem={handleDeleteChecklistItem}
                        />
                    </div>
                    <div>
                        <CommentComponent
                            listComments={getBoardWorkDataById?.comments.items}
                            onRefreshComments={refetchBoardWork}
                        />
                    </div>
                </div>)}
        </DrawerComponent>
    </>);
}