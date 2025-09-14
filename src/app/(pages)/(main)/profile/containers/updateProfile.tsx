"use client"
import { FieldErrors, useForm } from "react-hook-form";
import { UpsertProfileSchema } from "../models";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicInformationProfile from "../components/basicInformationProfile";
import { Button, Form } from "@/components/ui";
import { useEffect, useState } from "react";
import { Profile } from "../models/type/profile.type";
import { useAxiosMutation } from "@/hooks";
import { profileApiUrl } from "@/api/profile";
import { UpdateProfileMutationResponseType } from "../models/type/mutation.type";
import useToastState from "@/hooks/useToasts";
import { formatDate } from "../utils";
export interface UpdateProfileProps {
    id?: string;
   formItems: Profile | null;
   refetch: () => void;
}

const UpdateProfile = ({ id, formItems, refetch }: UpdateProfileProps) => {
    const { setToast } = useToastState();
    const form = useForm<z.infer<typeof UpsertProfileSchema>>({
        resolver: zodResolver(UpsertProfileSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            id: id,
            fullname: "",
            bio: "",
            slug: "",
            email: "",
            date_of_birth: undefined,
            gender: undefined,
            sentence: "",
            author: "",
        }
    });
    useEffect(() => {
  if (formItems) {
    form.reset({
      id: id,
      fullname: formItems.fullname,
      bio: formItems.bio,
      slug:  formItems.slug,
      email: formItems.email,
      date_of_birth: formItems.date_of_birth,
      gender: formItems.gender,
      sentence: formItems.sentence,
      author: formItems.author,
    });
  }
}, [formItems, id, form]);
    const {sendRequest} = useAxiosMutation<UpdateProfileMutationResponseType, unknown>({
        method: "PUT",
        url: profileApiUrl.updateUserProfile,
    });
    const onSubmit = async (values: z.infer<typeof UpsertProfileSchema>) => {
        const date_of_birth = formatDate.dateToNumber(values.date_of_birth);
        // Validate: must exist and not be a future date
        if (date_of_birth == null || date_of_birth > Date.now() || date_of_birth > Date.now() - 5 * 365 * 24 * 60 * 60 * 1000) {
            setToast({
                title: "Lỗi",
                message: "Ngày sinh không hợp lệ",
                variant: "error"
            });
            return;
        }

        const payload = { ...values, date_of_birth };
        const { error } = await sendRequest(payload);
        if (error) {
            setToast({
                title: "Lỗi",
                message: "Cập nhật thông tin cá nhân thất bại",
                variant: "error"
            });
        } else {
            setToast({
                title: "Thành công",
                message: "Cập nhật thông tin cá nhân thành công",
                variant: "success"
            });
        }
        setIsEditing(false);
        refetch();
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
                    refetch={refetch}
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