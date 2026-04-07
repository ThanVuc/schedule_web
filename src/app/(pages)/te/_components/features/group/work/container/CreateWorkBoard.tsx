'use client';

import { Form } from "@/components/ui";
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
import { useParams } from "next/navigation";
import { TeamDialogForm } from "../../../../common";


interface CreateWorkBoardDialogProps {
    open: boolean;
    loading?: boolean;
    listSprint?: ListSimpleSprintResponse[];
    onOpenChange?: (open: boolean) => void;
    refreshListWork?: () => void;
}
export const CreateWorkBoardDialog = ({ open, refreshListWork, loading, listSprint, onOpenChange }: CreateWorkBoardDialogProps) => {
    const [formReady, setFormReady] = useState(false);
    const { mode } = useModalParams();
    const params = useParams<{ id: string }>();
    const groupId = params?.id ?? "";
    const { sendRequest: createWork } = useAxiosMutation<WorkCreateWorkRequest>({
        method: "POST",
        url: `${boardWorksApiUrl.CRUDWORD}/${groupId}/works`,
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
        if (values.sprint_id === "null") {
            values.sprint_id = undefined;
        }
        if (mode === ModelType.CREATE) {
            await createWork(values);
            onOpenChange?.(false);
            refreshListWork?.();
        }
    }
    return (
        <>
            <TeamDialogForm
                open={open}
                onOpenChange={onOpenChange}
                size="md"
                title="Tạo công việc"
                warnOnClose={form.formState.isDirty}
                description="Tạo một công việc mới để quản lý và theo dõi tiến độ."
                submitDisabled={!form.formState.isValid}
                submitButtonText="Tạo công việc"
                cancelButtonText="Hủy"
                onSubmit={form.handleSubmit(onSubmit)}
            >
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
            </TeamDialogForm>
        </>
    );
};