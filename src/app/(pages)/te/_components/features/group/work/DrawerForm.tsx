'use client';

import { boardWorksApiUrl } from "@/api/boardWork";
import { useModalParams } from "@/app/(pages)/te/_hooks";
import { useDebouncedUpdate } from "@/app/(pages)/te/_hooks/useDebounced";
import { ListSimpleSprintResponse, WorkRequest } from "@/app/(pages)/te/_models";
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
import { useAxiosMutation } from "@/hooks";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type DrawerForm = z.infer<typeof UpdateWorkSchema>;

interface DrawerFormProps {
    form: UseFormReturn<DrawerForm>;
    version: number;
    listSprint?: ListSimpleSprintResponse[];
}

const DrawerForm = ({ form, version, listSprint }: DrawerFormProps) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [currentVersion, setCurrentVersion] = useState<number>(Number(version) || 0);
    const { id } = useModalParams();
    const { sendRequest: sendUpdateRequest } = useAxiosMutation({
        method: "PATCH",
        url: `${boardWorksApiUrl.UpdateBoardWork}2c9179a9-a279-4b26-851a-44e16b814d54/works/${id}`,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const updateWork = (payload: Partial<WorkRequest>) => {
        return sendUpdateRequest({ ...payload, version: currentVersion });
    };

    const handleResponse = (response: { data?: unknown }) => {
        const responseData = response?.data as { version?: number; item?: { version?: number } } | null;
        const nextVersion = responseData?.version ?? responseData?.item?.version;
        if (typeof nextVersion === "number") {
            setCurrentVersion(nextVersion);
        }

    };


    const { debouncedUpdate, cleanup } = useDebouncedUpdate(updateWork, 2000, handleResponse);

    useEffect(() => {
        setCurrentVersion(Number(version) || 0);
    }, [version]);

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);
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
                                        debouncedUpdate({ name: field.value });
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
                                        debouncedUpdate({ description: field.value });
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
                                <Select value={field.value.toString()} onValueChange={(value) => {
                                    const statusValue = Number(value);
                                    const isValidStatus = Number.isInteger(statusValue) && statusValue >= 1 && statusValue <= 4;
                                    if (!isValidStatus) return;

                                    field.onChange(statusValue);
                                    updateWork({ status: statusValue });
                                }}>
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
                                    <Select value={field.value?.toString()} onValueChange={
                                        (value) => {
                                            const priorityValue = Number(value);
                                            const isValidPriority = Number.isInteger(priorityValue) && priorityValue >= 1 && priorityValue <= 4;
                                            if (!isValidPriority) return;
                                            field.onChange(priorityValue);
                                            updateWork({ priority: priorityValue });
                                        }
                                    }>
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === "" ? undefined : value);
                                            debouncedUpdate({ due_date: value === "" ? undefined : value });
                                        }}
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
                                            debouncedUpdate({ story_point: value === "" ? undefined : Number(value) });
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
                                    <Select value={field.value} onValueChange={
                                        (value) => {
                                            if (value === "NoSprint") {
                                                field.onChange(undefined);
                                                updateWork({ is_unset_sprint: true });
                                                return;
                                            }
                                             if (!value) return;
                                            field.onChange(value);
                                            updateWork({ sprint_id: value });
                                        }
                                    }>
                                        <SelectTrigger className="w-full border-0 bg-transparent px-0 text-base text-white shadow-none focus-visible:ring-0">
                                            <SelectValue placeholder="Select sprint" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="NoSprint">No Sprint</SelectItem>
                                                {listSprint?.map((sprint) => (
                                                    <SelectItem key={sprint.id} value={sprint.id}>
                                                        {sprint.name}
                                                    </SelectItem>
                                                ))}
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