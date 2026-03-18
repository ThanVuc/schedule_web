'use client';
import { DrawerComponent } from "../features/group/work/Drawer";
import { ModelType } from "@/app/(pages)/schedule/_constant/common";
import { useModalParams } from "../../_hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CreateChecklistItemRequest,
    UpdateChecklistItemRequest,
    UpdateChecklistItemResponse,
    upsertWorkSchema,
} from "@/app/(pages)/te/_models/works/schema/index";
import { Form } from "@/components/ui";
import z from "zod";
import DrawerForm from "../features/group/work/DrawerForm";
import CheckListComponent from "../features/group/work/CheckListComponent";
import CommentComponent from "../features/group/work/CommentComponent";
import { useAxios, useAxiosMutation, useToastState } from "@/hooks";
import { ChecklistApiUrl } from "@/api/checklist";
import { ChecklistItemResponse } from "@/app/(pages)/te/_models/works/CheckList";
import { WorkDetailResponse, WorkRequest } from "../../_models";
import { boardWorksApiUrl } from "@/api/boardWork";
import { useEffect } from "react";

export const DrawerPage = () => {
    const { mode, id, workId } = useModalParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const openDrawer = mode === ModelType.UPDATE
    const { setToast } = useToastState();

    const { sendRequest: createChecklistItem } = useAxiosMutation<ChecklistItemResponse, CreateChecklistItemRequest>({
        method: "POST",
        url: `${ChecklistApiUrl.CreateCheckList}/${workId}/checklists`,
        headers: {
            "Content-Type": "application/json"
        }
    })
    const { sendRequest: updateChecklistItem } = useAxiosMutation<UpdateChecklistItemResponse, UpdateChecklistItemRequest>({
        method: "PATCH",
        url: `${ChecklistApiUrl.UpdateCheckList}`,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const {data: getBoardWorkDataById} = useAxios<WorkDetailResponse>({
        method: "GET",
        url: `${boardWorksApiUrl.GetBoardWorks}/${id}`
    })
    const { sendRequest:  sendUpdateRequest} = useAxiosMutation<WorkRequest>({
        method: "PATCH",
        url: `${boardWorksApiUrl.UpdateBoardWork}/${id}`,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const form = useForm({
        resolver: zodResolver(upsertWorkSchema),
        defaultValues: {
            name: "Name",
            description: "Create a modern and user-friendly login page with email and password fields, forgot password link, and sign-up option.",
            status: 1,
            priority: 1,
            due_date: undefined,
            story_point: undefined,
            sprint_id: undefined,
            assignee_id: undefined,
            assignee_name: "Jane Smith",
            version: undefined,
        }
    });

    type UpsertWorkValues = z.infer<typeof upsertWorkSchema>;
    
    useEffect(() => {
         if (mode !== ModelType.CREATE && mode !== ModelType.DELETE && getBoardWorkDataById) {
            form.reset({
                name: getBoardWorkDataById.name,
                description: getBoardWorkDataById.description,
                status: getBoardWorkDataById.status,
                priority: getBoardWorkDataById.priority,
                due_date: getBoardWorkDataById.due_date,
                story_point: getBoardWorkDataById.story_point,
                sprint_id: getBoardWorkDataById.sprint_id,
                assignee_id: getBoardWorkDataById.assignee.id,
                assignee_name: getBoardWorkDataById.assignee.name,
                version: getBoardWorkDataById.version,
            })
         }
    }, [getBoardWorkDataById])

    const handleEdit = async (values: UpsertWorkValues) => {
        const changedValues: Partial<UpsertWorkValues> = {};

        Object.entries(form.formState.dirtyFields).forEach(([key, isDirty]) => {
            if (isDirty === true) {
                (changedValues as Record<string, string | number | undefined>)[key] = values[key as keyof UpsertWorkValues];
            }
        });

        if (Object.keys(changedValues).length === 0) {
            setToast({
                title: "Thông báo",
                message: "Không có thay đổi để cập nhật.",
                variant: "success",
            });
            return;
        }

        if (values.version !== undefined) {
            changedValues.version = values.version;
        }

        const { error } = await sendUpdateRequest(changedValues, id ?? undefined);

        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể cập nhật công việc.",
                variant: "error",
            });
            return;
        }

        setToast({
            title: "Thành công",
            message: "Đã cập nhật công việc.",
            variant: "success",
        });

        closeModal();
    }

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/te/group/work?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }
    const onSubmit = async (values: UpsertWorkValues) => {
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === ModelType.UPDATE) {
            await handleEdit(values);
        }
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

    return (<>
        <DrawerComponent
            open={openDrawer}
            onClose={closeModal}
            onSubmit={() => { }}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DrawerForm form={form} />
                </form>
            </Form>
            <div>
                <CheckListComponent
                    items={getBoardWorkDataById?.check_lists}
                    onCreateItem={handleCreateChecklistItem}
                    onUpdateItem={handleUpdateChecklistItem}
                />
            </div>
            <div>
                <CommentComponent
                comments={getBoardWorkDataById?.comments}
                />
            </div>
        </DrawerComponent>
    </>);
}