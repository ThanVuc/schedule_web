'use client';


import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton } from "../../../../common/TeamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { useAxiosMutation } from "@/hooks/useAxios";
import { ListSimpleSprintResponse, WorkDetailResponse } from "@/app/(pages)/te/_models/works/WorkResponse";
import { useMemo, useState } from "react";
import { boardWorksApiUrl } from "@/api/boardWork";
import { useModalParams } from "@/app/(pages)/schedule/(features)/daily/hooks/useModalParams";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { useSearchParams } from "next/navigation";



export interface AddToSprintWorkBoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refreshListWork?: () => void;
    getBoardWorkDataById?: WorkDetailResponse;
    GetListSprint?: ListSimpleSprintResponse[];
}
export const AddToSprintWorkBoardDialog = ({ open, onOpenChange, refreshListWork, getBoardWorkDataById, GetListSprint }: AddToSprintWorkBoardDialogProps) => {
    const { id, mode } = useModalParams();
    const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>();

    const searchParams = useSearchParams();
        const listParams = useMemo(() => {
            const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
            return Object.fromEntries(entries);
        }, [searchParams]);
    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setSelectedSprintId(undefined);
        }
        onOpenChange(nextOpen);
    };

    const { sendRequest: sendUpdateRequest } = useAxiosMutation({
        method: "PATCH",
        url: `${boardWorksApiUrl.UpdateBoardWork}/works/${id}`,
        headers: {
            "Content-Type": "application/json"
        },
        params: { ...listParams },

    });

    const onSubmit = async () => {
        if (!selectedSprintId) return;

        const sendRequestBody = {
            sprint_id: selectedSprintId,
            version: getBoardWorkDataById?.version || 0,
        };

        if (mode === ModelType.ADDSPRINT) {
            await sendUpdateRequest(sendRequestBody);
            refreshListWork?.();
            handleOpenChange(false);
        }
    };
    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent size="sm">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">Thêm vào Sprint</DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                            Chọn sprint để thêm công việc vào. Bạn có thể quản lý các sprint trong phần cài đặt nhóm.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogBody>
                        <div className="flex flex-col gap-2"    >
                            <Label htmlFor="sprint-select" className="text-sm text-gray-300 mb-1">Chọn Sprint</Label>
                            <Select value={selectedSprintId} onValueChange={(value) => setSelectedSprintId(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn sprint" />
                                </SelectTrigger>
                                <SelectContent className="z-200">
                                    <SelectGroup>
                                        {GetListSprint?.map((sprint) => (
                                            <SelectItem key={sprint.id} value={sprint.id}>
                                                {sprint.name}
                                            </SelectItem>
                                        ))}

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <DialogClose asChild>
                            <DialogCancelButton>
                                Thoát
                            </DialogCancelButton>
                        </DialogClose>
                        <DialogPrimaryButton
                            confirmSubmit
                            onClick={() => { onSubmit() }}
                        >
                            Thêm vào
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};