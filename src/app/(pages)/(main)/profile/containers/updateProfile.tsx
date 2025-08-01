import { FieldErrors, useForm } from "react-hook-form";
import { UpsertProfileSchema } from "../models";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicInformationProfile from "../components/basicInformationProfile";
import { Button, Form } from "@/components/ui";
import { useState } from "react";
export interface UpdateProfileProps {
    id?: string;
}

const UpdateProfile = ({ id, }: UpdateProfileProps) => {

    const form = useForm<z.infer<typeof UpsertProfileSchema>>({
        resolver: zodResolver(UpsertProfileSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            id: "",
            name: "",
            description: "",
            slug: "",
            email: "",
            dateOfBirth: "",
            gender: undefined,
            motivation: "",
            author: "",
        }
    });
    
    const onSubmit = async (values: z.infer<typeof UpsertProfileSchema>) => {
        console.log("Form submitted with values:", values);
        setIsEditing(false)
    }
    const onError = (errors: FieldErrors<z.infer<typeof UpsertProfileSchema>>) => {
        console.warn("Validation errors:", errors);
    }

    const [isEditing, setIsEditing] = useState(false);
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-2"
            >
                <BasicInformationProfile
                    form={form}
                    isEditing={isEditing}
                    onSubmit={() => {
                        form.handleSubmit(onSubmit, onError)();
                    }}
                    onCancel={() =>
                        setIsEditing(false)
                    }
                    trigger={
                        !isEditing ? (
                            <div className="flex justify-end">
                                <Button type="button" className="!bg-[#005CF3] !text-white" onClick={() => {
                                    setIsEditing(true);
                                }}>
                                    Chỉnh sửa
                                </Button>
                            </div>
                        ) : (
                            null
                        )
                    }
                />

            </form>
        </Form >
    );
}
export default UpdateProfile;