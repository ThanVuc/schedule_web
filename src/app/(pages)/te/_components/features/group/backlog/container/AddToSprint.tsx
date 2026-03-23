'use client';


import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton} from "../../../../common/teamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";



export interface AddToSprintWorkBoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export const AddToSprintWorkBoardDialog = ({ open, onOpenChange }: AddToSprintWorkBoardDialogProps) => {

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
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
                            <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn sprint" />
                            </SelectTrigger>
                            <SelectContent className="z-200">
                                <SelectGroup>
                                    <SelectItem value="sprint1">Sprint 1</SelectItem>
                                    <SelectItem value="sprint2">Sprint 2</SelectItem>
                                    <SelectItem value="sprint3">Sprint 3</SelectItem>
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
                        >
                            Thêm vào
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};