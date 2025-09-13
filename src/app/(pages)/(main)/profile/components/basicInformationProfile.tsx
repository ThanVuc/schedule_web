'use client';
import { EmailIcon, GenderIcon, LinkIcon, NameIcon, UserIdIcon } from "@/components/icon";
import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea
} from "@/components/ui";
import { DateInput } from "@/components/common";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { UpsertProfileSchema } from "../models";
import { formatDate } from "../utils";

type ProfileForm = z.infer<typeof UpsertProfileSchema>

interface BasicInformationProfileProps {
    form: UseFormReturn<ProfileForm>
    isEditing?: boolean
    onCancel?: () => void
    trigger?: React.ReactNode
    onSubmit?: () => void
}

const BasicInformationProfile = ({ form, isEditing, onCancel, trigger, onSubmit }: BasicInformationProfileProps) => {
    return (
        <div className=" text-white w-full max-w-5xl mx-auto p-4 rounded-2xl shadow-md border border-[#ffff]/10">
            <h2 className="text-2xl font-semibold mb-6">Tiểu sử & Chi tiết khác
                {trigger}
                {isEditing && (<div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={() => {
                            if (onSubmit) onSubmit();
                        }}
                    >
                        Lưu
                    </Button>
                    <Button type="button" variant="outline" onClick={() => onCancel && onCancel()}>
                        Hủy
                    </Button>
                </div>)}
            </h2>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6.5 space-x-2 ">
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extralight font-poppins text-white/50">ID</FormLabel>
                                <div className="border-b-1 relative">
                                    <FormControl className=" border-none !bg-transparent">
                                        <Input className="disabled:opacity-100 disabled:text-white disabled:font-bold" disabled placeholder="ID" {...field} />
                                    </FormControl>
                                    <UserIdIcon className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extralight font-poppins  text-white/50">Email</FormLabel>
                                <div className="border-b-1 relative">
                                    <FormControl className=" border-none !bg-transparent">
                                        <Input className="disabled:opacity-100 disabled:text-white disabled:font-bold" disabled placeholder="Nhập email" {...field} />
                                    </FormControl>
                                    <EmailIcon className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extralight font-poppins  text-white/50">Họ và tên</FormLabel>
                                <div className={!isEditing ? "border-b-1 relative" : "border-b-1 relative border-white/40"}>
                                    <FormControl className=" border-none !bg-transparent">
                                        <Input className="disabled:opacity-100 disabled:text-white disabled:font-bold" disabled={!isEditing} placeholder="Họ và tên" {...field} />
                                    </FormControl>
                                    <NameIcon className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                            <FormItem >
                                <div className={!isEditing ? "border-b-1 relative" : "border-b-1 relative border-white/40"}>
                                    <FormControl className=" border-none !bg-transparent">
                                        <DateInput
                                            isBlurAfterDisabled={false}
                                            label="Ngày sinh"
                                            inputProps={{
                                                placeholder: "dd/mm/yyyy",
                                                className: " border-none !bg-transparent disabled:text-white ",
                                            }}
                                            defaultValue={formatDate.dateToString(field.value)}
                                            onChange={(date) => {
                                                if (typeof date === "number") {
                                                    date = new Date(date);
                                                }
                                                field.onChange(date ? date : null);
                                            }}
                                            disabled={!isEditing}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="relative">
                    {!isEditing ? (
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-extralight font-poppins text-white/50">
                                        Giới tính
                                    </FormLabel>
                                    <div className="border-b-1 relative">
                                        <FormControl className="border-none !bg-transparent">
                                            <Input className="disabled:opacity-100 disabled:text-white disabled:font-bold" value={field.value === true ? "Nam" : "Nữ"} readOnly />
                                        </FormControl>
                                        <GenderIcon className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />)

                        : (<FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-extralight font-poppins text-white/50">
                                        Giới tính
                                    </FormLabel>
                                    <div className={!isEditing ? "border-b-1 relative" : "border-b-1 relative border-white/40"}>
                                        <FormControl className="border-none !bg-transparent">
                                            <Select
                                                value={
                                                    typeof field.value === "boolean"
                                                        ? field.value
                                                            ? "male"
                                                            : "female"
                                                        : ""
                                                }
                                                onValueChange={(val) => field.onChange(val === "male")}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className="border-none !bg-transparent w-full">
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Nam</SelectItem>
                                                    <SelectItem value="female">Nữ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <GenderIcon className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />)}


                </div>
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extralight font-poppins  text-white/50">Slug</FormLabel>
                                <div className="border-b-1 relative">
                                    <FormControl className=" border-none !bg-transparent">
                                        <Input className="disabled:opacity-100 disabled:text-white disabled:font-bold" disabled placeholder="slug" {...field} />
                                    </FormControl>
                                    <LinkIcon className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="relative md:col-span-2">
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="font-extralight flex justify-between font-poppins text-white/50">Tiểu sử<FormLabel className="font-extralight font-poppins text-white/50">  *Tối đa 300 ký tự</FormLabel>
                                </FormLabel>
                                <FormControl className="!border-dashed !bg-transparent">
                                    <Textarea
                                        disabled={!isEditing}
                                        placeholder="Tiểu sử"
                                        {...field}
                                        className="w-full min-h-[100px] disabled:opacity-100 disabled:text-white disabled:font-bold"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="mt-6">
                {!isEditing ?
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/10 transition-all">

                        <FormField
                            control={form.control}
                            name="sentence"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormControl >
                                        <p className="text-white text-base mb-2 italic">{field.value || "Bạn nên có một câu nói tâm đắc..."}</p>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl >
                                        <p className="text-white/70 text-sm italic">- {field.value || "Khuyết Danh"}</p>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> : (<div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/10 transition-all">
                        <FormField
                            control={form.control}
                            name="sentence"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel className="font-extralight font-poppins  text-white/50">Câu nói tâm đắc</FormLabel>
                                    <FormControl >
                                        <Input
                                            className="disabled:opacity-100 disabled:text-white disabled:font-bold bg-transparent border border-white/10 text-white"
                                            disabled={!isEditing}
                                            {...field}
                                            placeholder="Một câu nói truyền cảm hứng cho bạn"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-extralight font-poppins  text-white/50">Tác giả</FormLabel>
                                    <FormControl >
                                        <Input
                                            className="disabled:opacity-100 disabled:text-white bg-transparent border border-white/10 text-white"
                                            disabled={!isEditing}
                                            {...field}
                                            placeholder="Tác giả"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>)}
            </div>
        </div>
    );
};

export default BasicInformationProfile;
