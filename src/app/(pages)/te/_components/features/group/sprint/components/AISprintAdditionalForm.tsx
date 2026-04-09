"use client";

import { FormField, FormMessage, Input, Textarea } from "@/components/ui";
import type { UseFormReturn } from "react-hook-form";
import type { SprintAiGenerationRequest } from "../../../../../_models/sprints/schema/sprint.schema";

interface AISprintAdditionalFormProps {
    form: UseFormReturn<SprintAiGenerationRequest>;
}

export default function AISprintAdditionalForm({ form }: AISprintAdditionalFormProps) {
    return (
        <div className="space-y-3">
            <div className="space-y-1.5">
                <div className="text-sm text-gray-300 font-medium">Tên Sprint</div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <div>
                            <Input
                                {...field}
                                className="w-full rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-2.5 text-sm outline-none focus:border-[#42A5F5]/60"
                                placeholder="Nhập tên sprint"
                            />
                            <FormMessage />
                        </div>
                    )}
                />
            </div>

            <div className="space-y-1.5">
                <div className="text-sm text-gray-300 font-medium">Mục tiêu Sprint</div>
                <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                        <div>
                            <Input
                                {...field}
                                className="w-full rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-2.5 text-sm outline-none focus:border-[#42A5F5]/60"
                                placeholder="Nhập mục tiêu sprint"
                            />
                            <FormMessage />
                        </div>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <div className="text-sm text-gray-300 font-medium">Ngày bắt đầu</div>
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                            <div>
                                <Input
                                    {...field}
                                    type="date"
                                    className="w-full rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-2.5 pr-2 text-sm outline-none focus:border-[#42A5F5]/60 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <FormMessage />
                            </div>
                        )}
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="text-sm text-gray-300 font-medium">Ngày kết thúc</div>
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <div>
                                <Input
                                    {...field}
                                    type="date"
                                    className="w-full rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-2.5 text-sm outline-none focus:border-[#42A5F5]/60 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <FormMessage />
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-xs text-gray-400 font-semibold">Ngữ cảnh bổ sung</div>
                <FormField
                    control={form.control}
                    name="additional_context"
                    render={({ field }) => (
                        <div>
                            <Textarea
                                {...field}
                                rows={6}
                                className="w-full resize-none rounded-lg border border-[#1E2A3A] bg-[#0D1520] text-white px-4 py-3 text-sm outline-none focus:border-[#42A5F5]/60"
                                placeholder="Mô tả thêm bối cảnh để AI tạo sprint chính xác hơn..."
                            />
                            <FormMessage />
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
