'use client';

import { Form } from "@/components/ui";
import { Plus } from "lucide-react";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton } from "../../../../common/teamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateWorkBacklogSchema } from "@/app/(pages)/te/_models/works/schema/CreateWorkBacklog.chema";
import CreateWorkBacklogForm from "../CreateWorkBacklogForm";


interface CreateBacklogProps {
    open: boolean;
    onConfirm: (name: string) => void;
}
export const CreateBacklogDialog = ({ open, onConfirm }: CreateBacklogProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(CreateWorkBacklogSchema),
        defaultValues: {
            name: "",
            description: "",
            Assignee_id: undefined,
            Status: 1,
            Priority: 1,
            Story_point: 1,
            Due_date: undefined,
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
                                <CreateWorkBacklogForm form={form} />
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