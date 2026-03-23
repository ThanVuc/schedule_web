'use client';

import { Form} from "@/components/ui";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton} from "../../../../common/teamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssignWorkSchema } from "@/app/(pages)/te/_models/works/schema/AssginWork.schema";
import AssignWorkForm from "../AssignWorkForm";


export interface AssignWorkBoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (name: string) => void;
}
export const AssignWorkBoardDialog = ({ open, onOpenChange, onConfirm }: AssignWorkBoardDialogProps) => {

    const form = useForm({
        resolver: zodResolver(AssignWorkSchema),
        defaultValues: {
            name: "",
            avatar_url: undefined,
        }
    });

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
                                <AssignWorkForm form={form} />
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
                            onClick={form.handleSubmit((data) => {
                                onConfirm(data.name);
                            })}
                        >
                            Phân công
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};