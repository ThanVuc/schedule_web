import { AppDialog } from "@/components/common";
import { Form } from "@/components/ui";
import { useToastState } from "@/hooks/useToasts";
import { ModelType } from "../../../_constant";
import { useModalParams } from "../hooks";
import { useConfirmDialog } from "@/hooks/useConfirmAlertDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { generateWorkAISchema } from "../_models/schema/generateWorkAI";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GenerateWorkAIForm from "../_components/generateWorkAIForm";
import { useAxiosMutation } from "@/hooks";
import { GenerationMutationResponseType, GenerationRequest } from "../_models/type/mutation.type";
import { worksApiUrl } from "@/api/work";

interface GenerateWorkAIProps {
    refetch?: () => void;
}
const buttonProps = {
    AI: {
        title: "Sinh Công Việc Mới (AI)",
        submitButtonText: "Tạo công việc",
        cancelButtonText: "Đóng",
    },
};
const GenerateWorkAI = ({ refetch }: GenerateWorkAIProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { confirm, dialog } = useConfirmDialog();
    const { mode } = useModalParams();
    const openDialog = mode === ModelType.GENERATEWORKAI;
    const { setToast } = useToastState();
    const { sendRequest } = useAxiosMutation<GenerationMutationResponseType, GenerationRequest>({
        method: "POST",
        url: worksApiUrl.generation,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const form = useForm<z.infer<typeof generateWorkAISchema>>({
        resolver: zodResolver(generateWorkAISchema),
        defaultValues: {
            prompts: [],
            local_date: new Date().toISOString().split("T")[0],
            additional_context: "",
        },
    });
    const HandleGenerateWorkAI = async (values: z.infer<typeof generateWorkAISchema>) => {
        const { error } = await sendRequest(values);
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Đã có lỗi xảy ra khi tạo công việc bằng AI, vui lòng thử lại sau",
                variant: "error",
            });
            return;
        }
        refetch?.();
        setToast({
            title: "Đang xử lý",
            message: "AI đang xử lý, vui lòng chờ giây lát...",
            variant: "default",
        })
        closeModal();
    }
    const onSubmit = async (values: z.infer<typeof generateWorkAISchema>) => {
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        if (mode === ModelType.GENERATEWORKAI) {
            HandleGenerateWorkAI(values)
        }
    }
    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
        form.reset();
        form.clearErrors();
    }
    return (<>
        <AppDialog
            dialogTitle={buttonProps.AI.title}
            cancelButtonText={buttonProps.AI.cancelButtonText}
            submitButtonText={buttonProps.AI.submitButtonText}
            onClose={closeModal}
            onSubmit={() => form.handleSubmit(onSubmit)()}
            open={openDialog}
            width="medium"
            height="medium"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <GenerateWorkAIForm form={form} />
                </form>
            </Form>
        </AppDialog>
        {dialog}
    </>);
}

export default GenerateWorkAI;