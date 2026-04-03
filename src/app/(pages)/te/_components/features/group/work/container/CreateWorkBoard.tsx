'use client';

import { Form } from "@/components/ui";
import { Plus } from "lucide-react";
import { Dialog, DialogBody, DialogCancelButton, DialogContent, DialogFooter, DialogHeader, DialogPrimaryButton } from "../../../../common/teamDialog";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import CreateWorkForm from "../CreateWorkForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWorkSchema } from "@/app/(pages)/te/_models/works/schema";
import { ListSimpleSprintResponse, WorkCreateWorkRequest } from "@/app/(pages)/te/_models";
import { useAxiosMutation } from "@/hooks/useAxios";
import { boardWorksApiUrl } from "@/api/boardWork";
import Spinner from "@/components/common/spinner";
import { useEffect, useState } from "react";
import z from "zod";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { useModalParams } from "@/app/(pages)/te/_hooks";


interface CreateWorkBoardDialogProps {
    open: boolean;
    loading?: boolean;
    listSprint?: ListSimpleSprintResponse[];
    onOpenChange?: (open: boolean) => void;
    refreshListWork?: () => void;
}
export const CreateWorkBoardDialog = ({ open,refreshListWork , loading, listSprint, onOpenChange }: CreateWorkBoardDialogProps) => {
    const [formReady, setFormReady] = useState(false);
    const { mode } = useModalParams();

    const { sendRequest: createWork } = useAxiosMutation<WorkCreateWorkRequest>({
        method: "POST",
        url: `${boardWorksApiUrl.CRUDWORD}/2c9179a9-a279-4b26-851a-44e16b814d54/works`,
    })

    useEffect(() => {
        if (!open) {
            setFormReady(false);
            return;
        }

        if (loading) {
            setFormReady(false);
            return;
        }

        setFormReady(true);
    }, [open, loading]);

    const form = useForm({
        resolver: zodResolver(CreateWorkSchema),
        defaultValues: {
            name: "",
            description: "",
            sprint_id: undefined,
        }
    });

    useEffect(() => {
        if (open) return;
        form.reset();
        form.clearErrors();
    }, [open, form]);

    const onSubmit = async (values: z.infer<typeof CreateWorkSchema>) => {
        if (mode === ModelType.CREATE) {
            await createWork(values);
            onOpenChange?.(false);
            refreshListWork?.();
        }
    }
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
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
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    {formReady ? (<CreateWorkForm form={form} sprints={listSprint || []} />
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Spinner />
                                        </div>)}
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
                            <Plus size={14} /> Tạo công việc
                        </DialogPrimaryButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};