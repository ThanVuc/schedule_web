'use client';
import { DateIcon, EmailIcon, GenderIcon, LinkIcon, NameIcon, UserIcon, UserIdIcon } from "@/components/icon";
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
import CardMotivation from "./cardMotivation";
import { DateInput } from "@/components/common";
interface BasicInformationProfileProps {
    form: any;
    isEditing?: boolean
    onCancel?: () => void;
    trigger?: React.ReactNode;
    onSubmit?: () => void;
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
                            onSubmit && onSubmit()
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extralight font-poppins  text-white/50">Họ và tên</FormLabel>
                                <div className="border-b-1 relative">
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
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem >
                                <div className="border-b-1 relative">
                                    <FormControl className=" border-none !bg-transparent">
                                        <DateInput
                                            isBlurAfterDisabled={false}
                                            label="Ngày sinh"
                                            className="!border-dashed !gap-2 !bg-transparent text-white/50"
                                            inputProps={{
                                                placeholder: "dd/mm/yyyy",
                                                className: " border-none !bg-transparent disabled:text-white ",
                                            }}
                                            defaultValue={field.value}
                                            onChange={(date) => field.onChange(date)}
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
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-extralight font-poppins text-white/50">Giới tính</FormLabel>
                                <div className="border-b-1 relative">
                                    <FormControl className="border-none !bg-transparent">
                                        <Select
                                            value={field.value === true ? "male" : field.value === false ? "female" : ""}
                                            onValueChange={(value) => field.onChange(value === "male")}
                                            disabled={!isEditing}

                                        >
                                            <SelectTrigger className="border-none !bg-transparent w-full">
                                                <SelectValue placeholder="Chọn giới tính" />
                                            </SelectTrigger>
                                            <SelectContent >
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
                    />

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
                        name="description"
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
                <CardMotivation
                    isEditing={isEditing}
                    control={form.control}
                    sentence={form.watch("motivation")}
                    author={form.watch("author")}
                />
            </div>
        </div>
    );
};

export default BasicInformationProfile;
