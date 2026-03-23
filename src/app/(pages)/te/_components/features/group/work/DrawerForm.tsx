
import { UpdateWorkSchema } from "@/app/(pages)/te/_models/works/schema/UpdateWork";
import {
    FormControl,
    FormField,
    FormItem,
    Input,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type DrawerForm = z.infer<typeof UpdateWorkSchema>;

interface DrawerFormProps {
    form: UseFormReturn<DrawerForm>;
}

const DrawerForm = ({ form }: DrawerFormProps) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    return (<>
        <div className="m-5 border-b-1 pb-3 border-[#2A3A4F]">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="w-full break-words whitespace-normal text-left">
                        {isEditingTitle ? (
                            <Input
                                autoFocus
                                {...field}
                                value={field.value || ""}
                                onBlur={() => {
                                    field.onBlur();
                                    setIsEditingTitle(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        setIsEditingTitle(false);
                                    }
                                }}
                            />
                        ) : (
                            <div
                                onClick={() => setIsEditingTitle(true)}
                                className="cursor-pointer  p-2 rounded min-h-[40px] flex items-center"
                            >
                                {field.value || "Click to add title"}
                            </div>
                        )}
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="w-full break-words whitespace-normal text-left">
                        {isEditingDescription ? (
                            <Input
                                autoFocus
                                {...field}
                                value={field.value || ""}
                                onBlur={() => {
                                    field.onBlur();
                                    setIsEditingDescription(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        setIsEditingDescription(false);
                                    }
                                }}
                            />
                        ) : (
                            <div
                                onClick={() => setIsEditingDescription(true)}
                                className="cursor-pointer p-2 rounded min-h-[40px] flex items-center text-sm text-gray-600"
                            >
                                {field.value || "No description. Click to add."}
                            </div>
                        )}
                    </FormItem>
                )}
            />
        </div>
        <div className="m-5">
            <div className="space-y-5">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <Label className="block text-sm font-semibold text-slate-300">Status</Label>
                            <FormControl>
                                <Select value={field.value.toString()} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full border-0 bg-transparent px-0 text-base text-white shadow-none focus-visible:ring-0">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">Todo</SelectItem>
                                            <SelectItem value="2">In Progress</SelectItem>
                                            <SelectItem value="3">Review</SelectItem>
                                            <SelectItem value="4">Completed</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label className="block text-sm font-semibold text-slate-300">Priority</Label>
                                <FormControl>
                                    <Select value={field.value?.toString()} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full border-0 bg-transparent px-0 text-base text-white shadow-none focus-visible:ring-0">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="1">Low</SelectItem>
                                                <SelectItem value="2">Medium</SelectItem>
                                                <SelectItem value="3">High</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="due_date"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label className="block text-sm font-semibold text-slate-300">Due Date</Label>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        className="h-9 border-0 bg-transparent px-0 text-base text-white shadow-none focus-visible:ring-0"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="story_point"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label className="block text-sm font-semibold text-slate-300">Story Points</Label>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="0"
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === "" ? undefined : Number(value));
                                        }}
                                        className="h-9 border-0 bg-transparent px-0 text-base text-white shadow-none focus-visible:ring-0"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sprint_id"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label className="block text-sm font-semibold text-slate-300">Sprint</Label>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full border-0 bg-transparent px-0 text-base text-white shadow-none focus-visible:ring-0">
                                            <SelectValue placeholder="Select sprint" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Sprint 1">Sprint 1</SelectItem>
                                                <SelectItem value="Sprint 2">Sprint 2</SelectItem>
                                                <SelectItem value="Sprint 3">Sprint 3</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    </>);
}

export default DrawerForm;