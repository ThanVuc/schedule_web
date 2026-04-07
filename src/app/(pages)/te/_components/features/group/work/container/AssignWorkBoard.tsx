'use client';

import { Form } from "@/components/ui";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton } from "../../../../common/TeamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssignWorkSchema } from "@/app/(pages)/te/_models/works/schema/AssginWork.schema";
import AssignWorkForm from "../AssignWorkForm";
import { ListSimpleUserResponse, WorkDetailResponse } from "@/app/(pages)/te/_models";
import { useAxiosMutation } from "@/hooks/useAxios";
import { boardWorksApiUrl } from "@/api/boardWork";
import { useModalParams } from "@/app/(pages)/schedule/(features)/daily/hooks/useModalParams";
import z from "zod";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { useEffect } from "react";
import { useParams } from "next/navigation";


export interface AssignWorkBoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refreshListWork?: () => void;
    listUser?: ListSimpleUserResponse[];
    getBoardWorkDataById?: WorkDetailResponse;
}
export const AssignWorkBoardDialog = ({ open, onOpenChange, refreshListWork, listUser, getBoardWorkDataById }: AssignWorkBoardDialogProps) => {

    const { mode, id } = useModalParams();
    const params = useParams<{ id: string }>();
    const groupId = params?.id ?? "";
    const { sendRequest: sendUpdateRequest } = useAxiosMutation({
        method: "PATCH",
        url: `${boardWorksApiUrl.UpdateBoardWork}${groupId}/works/${id}`,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const form = useForm({
        resolver: zodResolver(AssignWorkSchema),
        defaultValues: {
            id: getBoardWorkDataById?.assignee.id,
            email: getBoardWorkDataById?.assignee.email,
            avatar_url: getBoardWorkDataById?.assignee.avatar,
        }
    });
    useEffect(() => {
        if (getBoardWorkDataById) {
            form.reset({
                id: getBoardWorkDataById.assignee?.id,
                email: getBoardWorkDataById.assignee?.email,
                avatar_url: getBoardWorkDataById.assignee?.avatar,
            });
        }
    }, [getBoardWorkDataById, mode]);

    const onSubmit = async (values: z.infer<typeof AssignWorkSchema>) => {
        if (mode === ModelType.ASSIGN) {
            if (!values.id) {
                await sendUpdateRequest({
                    is_unassigned: true,
                    version: getBoardWorkDataById?.version || 0,
                });
                refreshListWork?.();
                onOpenChange(false);
                return;
            }

            await sendUpdateRequest({
                assignee_id: values.id,
                version: getBoardWorkDataById?.version || 0,
            });
            refreshListWork?.();
            onOpenChange(false);
        }
    }
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent size="md">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">Phân công công việc</DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                            Phân công một công việc mới cho thành viên trong nhóm.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogBody>
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <AssignWorkForm form={form} listUser={listUser} />
                                </form>
                            </Form>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <DialogClose asChild>
                            <DialogCancelButton>
                                Thoát
                            </DialogCancelButton>
                        </DialogClose>
                        <DialogPrimaryButton
                            disabled={!form.formState.isValid}
                            confirmSubmit
                            onClick={() => form.handleSubmit(onSubmit)()}
                        >
                            Phân công
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};