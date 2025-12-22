"use client";
import { AddIcon, ClearIcon, TrashIcon } from "@/components/icon";
import { Button, Checkbox, Input, Label, Progress } from "@/components/ui";
import { useState } from "react";
import { miniTask } from "../../_models/miniTask.model";
import { useConfirmDialog } from "@/hooks";

interface MiniTaskProps {
    value?: miniTask[];
    onChange?: (value: miniTask[]) => void;
    disabled?: boolean;
}

const MiniTask = ({ value = [], onChange, disabled }: MiniTaskProps) => {
    const [openInput, setOpenInput] = useState(false);
    const [newInput, setNewInput] = useState("");

    const MAX_TASKS = 5;
    const dataList = value;

    const { confirm, dialog } = useConfirmDialog();

    const update = (next: miniTask[]) => {
        onChange?.(next);
    };

    const handleAddTask = () => {
        if (!newInput.trim() || dataList.length >= MAX_TASKS) return;

        update([
            ...dataList,
            { name: newInput.trim(), is_completed: false }
        ]);

        setNewInput("");
        setOpenInput(false);
    };

    const handleDeleteTask = (index: number) => {
        update(dataList.filter((_, i) => i !== index));
    };

    const handleClearAll = async () => {
        if (!(await confirm())) return;
        update([]);
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <Label className="text-lg mb-5 text-[#E6E6E2] font-bold">
                    Chia nhỏ công việc
                </Label>
                <Button className=" disabled:opacity-100 disabled:cursor-not-allowed border-1 border-[#FF8080] bg-[#FF8080]/20 text-[#FF8080] hover:bg-[#FF8080]/60"
                    type="button"
                    onClick={() => handleClearAll()}
                    disabled={disabled}
                >
                    <ClearIcon className="!w-4 !h-4 mr-2" />
                    Xoá tất cả
                </Button>
            </div>
            {dialog}
            <div className="ml-8">
                <div className="flex items-center gap-3">
                    <p className="font-bold">
                        {dataList.length > 0
                            ? Math.round((dataList.filter((item) => item.is_completed).length / dataList.length) * 100)
                            : 0}
                        %
                    </p>
                    <Progress
                        className="[&>div]:bg-[#01BC39]"
                        value={
                            (dataList.filter((item) => item.is_completed).length / dataList.length) * 100 || 0
                        }
                    />
                </div>
                {dataList.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 border-b border-white/10 py-2"
                    >
                        <Checkbox
                            disabled={disabled}
                            className="w-5 h-5 border-white/60 border-3"
                            checked={item.is_completed}
                            onCheckedChange={(checked) => {
                                const updated = [...dataList];
                                updated[index] = {
                                    ...updated[index],
                                    is_completed: !!checked,
                                };
                                update(updated);
                            }}
                        />
                        <span
                            className={
                                item.is_completed ? "line-through text-gray-400 flex-1" : "flex-1"
                            }
                        >
                            {item.name}
                        </span>
                        <button type="button" disabled={disabled}>
                            <TrashIcon
                                className="!w-5 !h-5 text-[#FF6B6B] cursor-pointer"
                                onClick={() => handleDeleteTask(index)}
                            />
                        </button>
                    </div>
                ))}
                {openInput && (
                    <div className="flex items-center gap-5 border-b border-white/20 mb-5 pb-2">
                        <Checkbox className="w-5 h-5 border-white/60 border-3" disabled />
                        <Input
                            placeholder="Nhập công việc cần thêm"
                            value={newInput}
                            onChange={(e) => setNewInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTask();
                                }
                            }}
                        />
                        <TrashIcon
                            className="!w-7 !h-7 text-[#FF6B6B] cursor-pointer"
                            onClick={() => setOpenInput(false)}
                        />
                    </div>
                )}
                <div className="mt-3">
                    <Button

                        className=" flex items-center bg-[#3DF875]/20 hover:bg-[#3DF875]/40 border-[#3DF875] text-[#3DF875] border rounded-sm p-5 disabled:opacity-40 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => setOpenInput(true)}
                        disabled={dataList.length >= MAX_TASKS || disabled}
                    >
                        <AddIcon className="!w-4 !h-4 mr-2" />
                        {dataList.length >= MAX_TASKS
                            ? "Đã đạt giới hạn (5)"
                            : "Thêm công việc con"}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default MiniTask;
