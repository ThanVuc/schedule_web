'use client';

import { Form } from "@/components/ui";
import { Plus } from "lucide-react";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton} from "../../../../common/teamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import CreateWorkForm from "../CreateWorkForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWorkSchema } from "@/app/(pages)/te/_models/works/schema";
import { useRouter, useSearchParams } from "next/navigation";


interface CreateWorkBoardDialogProps {
    open: boolean;
    onConfirm: (name: string) => void;
}
export const CreateWorkBoardDialog = ({ open, onConfirm }: CreateWorkBoardDialogProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(CreateWorkSchema),
        defaultValues: {
            name: "",
            description: "",
            Sprint_id: undefined,
        }
    });
    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/te/group/work?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }
    return (
        <>
            <Dialog open={open} onOpenChange={closeModal}>
                <DialogContent size="md">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl">Tạo công việc</DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                            Tạo một công việc mới để quản lý và theo dõi tiến độ.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody>
                        <div>
                            <Form {...form}>
                                <CreateWorkForm form={form} />
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
                            <Plus size={14} /> Tạo công việc
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};