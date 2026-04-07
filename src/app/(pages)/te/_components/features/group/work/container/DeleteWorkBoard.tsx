'use client';

import React from "react";
import { Trash2 } from "lucide-react";

import { TrashIcon } from "@/components/icon";
import { Dialog, DialogClose, DialogDescription, DialogTitle } from "@/components/ui";
import { DialogBody, DialogCancelButton, DialogContent, DialogDangerButton, DialogFooter, DialogHeader } from "../../../../common/TeamDialog";
import { useAxiosMutation } from "@/hooks";
import { boardWorksApiUrl } from "@/api/boardWork";
import { useModalParams } from "@/app/(pages)/schedule/(features)/daily/hooks/useModalParams";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { useParams } from "next/navigation";

export interface DeleteWorkBoardDialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    refreshListWork?: () => void;
    disable?: boolean;
}


export const DeleteWorkBoardDialog = ({ open, onOpenChange, refreshListWork}: DeleteWorkBoardDialogProps) => {
    const { mode, id } = useModalParams();
    const params = useParams<{ id: string }>();
        const groupId = params?.id ?? "";
    const { sendRequest: DeleteWork } = useAxiosMutation({
        method: "DELETE",
        url: `${boardWorksApiUrl.CRUDWORD}/${groupId}/works`,
    })

    const onSubmit = async (id: string) => {
        if (mode === ModelType.DELETE) {
            await DeleteWork(undefined, id.toString());
            onOpenChange?.(false);
            refreshListWork?.();

        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="sm" >
                <DialogHeader
                    icon={<TrashIcon className="text-red-500" />
                    }
                >
                    <DialogTitle className="">Xóa bảng công việc</DialogTitle>
                    <DialogDescription className="">
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Bạn có chắc muốn xóa bảng công việc này không?
                        Tất cả công việc trong bảng sẽ bị xóa vĩnh viễn và không thể khôi phục.
                    </p>
                </DialogBody>

                <DialogFooter>
                    <DialogClose asChild>
                        <DialogCancelButton className="">
                            Hủy
                        </DialogCancelButton>
                    </DialogClose>
                    <DialogDangerButton
                        onClick={() => onSubmit(id as string)}
                    >
                        <Trash2 size={14} /> Xóa bảng công việc
                    </DialogDangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};