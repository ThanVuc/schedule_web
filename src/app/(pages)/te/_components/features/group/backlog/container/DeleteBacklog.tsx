'use client';

import React from "react";
import { Trash2 } from "lucide-react";

import { TrashIcon } from "@/components/icon";
import { Dialog, DialogClose, DialogDescription, DialogTitle } from "@/components/ui";
import { DialogBody, DialogCancelButton, DialogContent, DialogDangerButton, DialogFooter, DialogHeader } from "../../../../common/teamDialog";

export interface DeleteBacklogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

}


export const DeleteBacklogDialog = ({ open, onOpenChange }: DeleteBacklogDialogProps) => {


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="sm" >
                <DialogHeader
                    icon={<TrashIcon className="text-red-500" />
                    }
                >
                    <DialogTitle className="">Xóa công việc</DialogTitle>
                    <DialogDescription className="">
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Bạn có chắc muốn xóa công việc này không?
                        Tất cả thông tin liên quan đến công việc sẽ bị xóa vĩnh viễn và không thể khôi phục.
                    </p>
                </DialogBody>

                <DialogFooter>
                    <DialogClose asChild>
                        <DialogCancelButton className="">
                            Hủy
                        </DialogCancelButton>
                    </DialogClose>
                    <DialogDangerButton >
                        <Trash2 size={14} /> Xóa công việc
                    </DialogDangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};